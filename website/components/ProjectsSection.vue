<template>
  <section class="fullpage-section projects-section">
    <div class="content">
      <h1 class="page-title">{{ $t('projects') }}</h1>
      <div v-if="isSmallScreen" class="projects-carousel">
        <div class="carousel-navigation">
          <button class="nav-button prev" @click="prevCard" aria-label="上一個專案">
            &lt;
          </button>
          <div class="carousel-indicators">
            <span 
              v-for="(_, index) in projects" 
              :key="index" 
              :class="['dot', { active: currentCardIndex === index }]"
              @click="goToCard(index)"
            ></span>
          </div>
          <button class="nav-button next" @click="nextCard" aria-label="下一個專案">
            &gt;
          </button>
        </div>
        <div class="carousel-container" ref="carouselContainer">
          <ProjectCard 
            v-for="(project, index) in projects"
            :key="`carousel-${project.title}`"
            :project="project"
            :class="['project-card', { active: currentCardIndex === index }]"
            @mouseenter="pauseCarousel"
            @mouseleave="resumeCarousel"
          />
        </div>
      </div>
      
      <!-- 大螢幕無縫捲動模式 -->
      <div 
        v-else
        ref="projectsContainer" 
        class="projects"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @touchstart="startDragTouch"
        @touchmove="onDragTouch"
        @touchend="stopDragTouch"
      >
        <div class="projects-wrapper" ref="projectsWrapper">
          <ProjectCard 
            v-for="project in projects"
            :key="`original-${project.title}`" 
            :project="project"
            class="project-card"
            @mouseenter="pauseScroll"
            @mouseleave="resumeScroll"
          />
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick} from 'vue';
import { useScrollManager } from '~/composables/useScrollManager';

useHead({
  title: 'Barn'
});
const props = defineProps({
  projects: {
    type: Array,
    required: true
  },
  isLastSection: {
    type: Boolean,
    default: false
  }
});

const { enableScrolling } = useScrollManager();import ProjectCard from './ProjectCard.vue';

// 螢幕尺寸檢測
const isSmallScreen = ref(false);
const SMALL_SCREEN_BREAKPOINT = 768; 

// 輪播相關
const currentCardIndex = ref(0);
const carouselContainer = ref(null);
let carouselInterval = null;
let carouselPaused = false;
const CAROUSEL_INTERVAL = 4000; 

// 無縫捲動相關
const projectsContainer = ref(null);
const projectsWrapper = ref(null);
let animationId = null;
let isPaused = false;
let clonedCardsAdded = false;
let isResetting = false;
let lastTimestamp = 0;
let originalCardsWidth = 0; // 儲存原始卡片總寬度

// 拖曳相關變數
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// 設定滾動速度 (每毫秒移動的像素)
const SCROLL_SPEED = 0.07;

// 檢查螢幕尺寸
const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth < SMALL_SCREEN_BREAKPOINT;
};

// 輪播功能
const setupCarousel = () => {
  clearCarouselInterval();
  currentCardIndex.value = 0;
  startCarouselInterval();
};

const startCarouselInterval = () => {
  if (!carouselPaused) {
    carouselInterval = setInterval(nextCard, CAROUSEL_INTERVAL);
  }
};

const clearCarouselInterval = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
};

const nextCard = () => {
  currentCardIndex.value = (currentCardIndex.value + 1) % props.projects.length;
};

const prevCard = () => {
  currentCardIndex.value = (currentCardIndex.value - 1 + props.projects.length) % props.projects.length;
};

const goToCard = (index) => {
  currentCardIndex.value = index;
};

const pauseCarousel = () => {
  carouselPaused = true;
  clearCarouselInterval();
};

const resumeCarousel = () => {
  carouselPaused = false;
  startCarouselInterval();
};

// 計算原始卡片的總寬度
const calculateOriginalWidth = () => {
  if (!projectsWrapper.value) return 0;
  
  // 取得所有原始卡片 (不包括複製的)
  const originalCards = Array.from(projectsWrapper.value.children).slice(0, props.projects.length);
  if (originalCards.length === 0) return 0;
  
  // 計算總寬度 (卡片寬度 + 外邊距 + 間距)
  let totalWidth = 0;
  
  // 取得間隔寬度
  const gap = parseInt(window.getComputedStyle(projectsWrapper.value).gap) || 20;
  
  // 計算每個卡片的總寬度 (包含間隔)
  originalCards.forEach((card, index) => {
    const cardWidth = card.offsetWidth;
    const style = window.getComputedStyle(card);
    const marginRight = parseInt(style.marginRight) || 0;
    const marginLeft = parseInt(style.marginLeft) || 0;
    
    totalWidth += cardWidth + marginRight + marginLeft;
    
    // 添加間隔 (除了最後一個卡片)
    if (index < originalCards.length - 1) {
      totalWidth += gap;
    }
  });
  
  return totalWidth;
};

// 複製卡片以實現無縫捲動
const setupInfiniteScroll = async () => {
  if (!projectsWrapper.value || clonedCardsAdded || isSmallScreen.value) return;

  await nextTick();
  
  const originalCards = Array.from(projectsWrapper.value.querySelectorAll('.project-card')).slice(0, props.projects.length);
  
  if (originalCards.length === 0) return;
  
  originalCardsWidth = calculateOriginalWidth();
  
  originalCards.forEach((card, index) => {
    const clone = card.cloneNode(true);
    // 新增唯一key避免Vue警告
    clone.setAttribute('data-key', `cloned-${index}`);
    // 為複製的卡片添加相同的事件處理
    clone.addEventListener('mouseenter', pauseScroll);
    clone.addEventListener('mouseleave', resumeScroll);
    projectsWrapper.value.appendChild(clone);
  });
  
  clonedCardsAdded = true;
  
  // 開始自動滾動
  if (!animationId) {
    lastTimestamp = 0;
    animationId = requestAnimationFrame(autoScroll);
  }
};

const autoScroll = (timestamp) => {
  if (isSmallScreen.value) {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    return;
  }
  
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  
  if (!isPaused && !isDragging && projectsContainer.value && !isResetting && originalCardsWidth > 0) {
    projectsContainer.value.scrollLeft += SCROLL_SPEED * deltaTime;
    
    checkScrollPosition();
  }
  
  animationId = requestAnimationFrame(autoScroll);
};

const checkScrollPosition = () => {
  if (!projectsContainer.value || originalCardsWidth <= 0) return;
  
  if (projectsContainer.value.scrollLeft >= originalCardsWidth) {
    isResetting = true;
    
    projectsContainer.value.scrollLeft = 0;
    
    setTimeout(() => {
      isResetting = false;
    }, 20);
  }
};

const pauseScroll = () => {
  isPaused = true;
};

const resumeScroll = () => {
  isPaused = false;
};

// 滑鼠拖曳相關函數
const startDrag = (e) => {
  if (!projectsContainer.value) return;
  
  isDragging = true;
  startX = e.pageX - projectsContainer.value.offsetLeft;
  scrollLeft = projectsContainer.value.scrollLeft;
  
  // 變更游標樣式
  projectsContainer.value.style.cursor = 'grabbing';
  document.body.style.userSelect = 'none';
};

const onDrag = (e) => {
  if (!isDragging || !projectsContainer.value) return;
  
  e.preventDefault();
  const x = e.pageX - projectsContainer.value.offsetLeft;
  const walk = (x - startX) * 1.5; // 滾動倍率
  projectsContainer.value.scrollLeft = scrollLeft - walk;
};

const stopDrag = () => {
  if (!projectsContainer.value) return;
  
  isDragging = false;
  projectsContainer.value.style.cursor = 'grab';
  document.body.style.userSelect = '';
  
  // 重新檢查位置，確保無縫循環
  checkScrollPosition();
};

// 觸控事件處理
const startDragTouch = (e) => {
  if (!projectsContainer.value) return;
  
  isDragging = true;
  startX = e.touches[0].pageX - projectsContainer.value.offsetLeft;
  scrollLeft = projectsContainer.value.scrollLeft;
};

const onDragTouch = (e) => {
  if (!isDragging || !projectsContainer.value) return;
  
  const x = e.touches[0].pageX - projectsContainer.value.offsetLeft;
  const walk = (x - startX) * 1.5; // 滾動倍率
  projectsContainer.value.scrollLeft = scrollLeft - walk;
};

const stopDragTouch = () => {
  isDragging = false;
  
  // 重新檢查位置，確保無縫循環
  checkScrollPosition();
};

onMounted(async () => {
  // 初始檢查螢幕尺寸並設置對應模式
  checkScreenSize();

  setTimeout(() => {
    if (isSmallScreen.value) {
      setupCarousel();
    } else {
      setupInfiniteScroll();
    }
  }, 2000);

  // 視窗大小改變時重新檢查
  window.addEventListener('resize', handleResize);
});

const handleResize = () => {
  // 停止所有動畫和計時器
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  clearCarouselInterval();
  
  // 重置所有狀態
  isResetting = false;
  isPaused = false;
  isDragging = false;
  lastTimestamp = 0;
  
  // 清理複製元素
  if (projectsWrapper.value && !isSmallScreen.value) {
    const children = Array.from(projectsWrapper.value.children);
    children.slice(props.projects.length).forEach(child => {
      projectsWrapper.value.removeChild(child);
    });
  }
  
  // 重置狀態
  clonedCardsAdded = false;
  originalCardsWidth = 0;
  
  // 重新檢查螢幕尺寸並設置相應模式
  checkScreenSize();
};

onBeforeUnmount(() => {
  // 清理所有計時器和動畫
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  clearCarouselInterval();
  window.removeEventListener('resize', handleResize);

  enableScrolling();
});
</script>

<style scoped>
.projects-section {
  /* margin: 24px; */
  padding: 2rem 1rem;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1200px;
}

/* 大螢幕無縫捲動 */
.projects {
  height: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: auto;
  cursor: grab;
  user-select: none;
}

.projects:active {
  cursor: grabbing;
}

.projects-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 20px;
  height: 100%;
  will-change: transform;
}

.projects::-webkit-scrollbar {
  display: none;
}

/* 小螢幕輪播 */
.projects-carousel {
  width: 95%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.carousel-container {
  width: 100%;
  position: relative;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-navigation {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.nav-button {
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.carousel-indicators {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #333;
}

/* 輪播卡片 */
.projects-carousel .project-card {
  position: absolute;
  width: 90%;
  max-width: 300px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s ease;
  transform: scale(0.8) translateX(100%);
}

.projects-carousel .project-card.active {
  opacity: 1;
  visibility: visible;
  transform: scale(1) translateX(0);
}

@media (min-width: 768px) {
  .project-card {
    margin-right: 0;
  }
}
</style>