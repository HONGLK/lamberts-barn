<template>
  <div class="fullpage-container">
    <IntroSection 
      :fullText="fullText"
      :fullDescription="fullDescription"
      :tags="tags"
      :isLastSection="currentSection === sections.length - 1"
      class="fullpage-section"
      :class="{ 'active': currentSection === 0 }"
    />
    <!-- <SkillsSection :skills="skills" /> -->
    <!-- <TimelineSection :isLastSection="currentSection === sections.length - 1" /> -->
    <!-- 可以繼續添加更多 section -->
    <ProjectsSection 
      :projects="projects" 
      :isLastSection="currentSection === sections.length - 1" 
      class="fullpage-section"
      :class="{ 'active': currentSection === 1 }"
    />
    
    <!-- 視覺提示 - 當不是最後一頁時顯示 -->
    <div class="section-indicator" v-if="!isTransitioning">
      <div class="indicator-dot" v-for="(_, index) in sections" :key="index" 
        :class="{ 'active': currentSection === index }"
        @click="scrollToSection(index)"></div>
    </div>
    
    <!-- 開發模式下的調試信息 -->
    <div v-if="false" class="debug-info">
      <p>當前區塊: {{ currentSection + 1 }}/{{ sections.length }}</p>
      <p>過渡中: {{ isTransitioning }}</p>
      <p>滾動方向趨勢: {{ scrollTrend }}</p>
      <p>滾動位置比例: {{ scrollRatio.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import IntroSection from '~/components/IntroSection.vue'
import SkillsSection from '~/components/SkillSection.vue'
import TimelineSection from '~/components/TimelineSection.vue'
import ProjectsSection from '~/components/ProjectsSection.vue'
import { useI18n } from '#imports';
import { useScrollManager } from '~/composables/useScrollManager';
import { zhProjects, enProjects } from '~/data/projects';

const { disableScrolling, enableScrolling } = useScrollManager();
const { t, tm, locale } = useI18n();

// 實際資料為component內抓取I18n
const fullText = "您好！\n\n歡迎來到我的個人網站"
const fullDescription = "我是 Lambert，一名對IoT技術、人工智慧熱忱且將其融入生活的全端工程師\n誠如我的個人Logo，結合藍色與橘色，藍色代表科技，橘色代表熱忱。\nLambert's Barn 一點一點累積了這一路上的汗水、歡笑與坑洞，成為現在的我。"

const tags = ref(['Lambert', '台灣', '旅行', '技術狂熱', '學無止境', '閱讀', '行動派', '美食探索者', '孩子的爸爸', '斜槓青年', '知識分享者'])

const skills = [
  { icon: 'code', name: '領域 1' },
  { icon: 'design_services', name: '領域 2' },
  { icon: 'analytics', name: '領域 3' }
]

const projects = computed(() => {
  return locale.value === 'zh-TW' ? zhProjects : enProjects;
});

const sections = ref([]);
const currentSection = ref(0);
const isTransitioning = ref(false);
const scrollEvents = ref([]);
const scrollTrend = ref('無');
const scrollRatio = ref(0);
let lastScrollTime = 0;
const transitionDuration = 600; // 毫秒
const SCROLL_THRESHOLD = 0.98; // 捲動到內容的98%時才切換頁面（非常接近底部）
const SCROLL_THROTTLE = 150; // 滾動節流時間（毫秒）
const CONSECUTIVE_SCROLL_COUNT = 3; // 需要多少次連續滾動才觸發頁面切換

// 滾動事件處理器 - 直接使用防抖而非節流
const handleScroll = (e) => {
  // 如果正在過渡中，完全阻止滾動
  if (isTransitioning.value) {
    e.preventDefault();
    return;
  }

  // 防抖：只在滾動間隔足夠大時處理
  const now = Date.now();
  if (now - lastScrollTime < SCROLL_THROTTLE) {
    e.preventDefault(); // 阻止過於頻繁的滾動
    return;
  }
  lastScrollTime = now;

  // 記錄滾動方向
  const deltaY = e.deltaY;
  recordScrollDirection(deltaY);

  // 獲取當前活動的section元素
  const currentEl = sections.value[currentSection.value];
  if (!currentEl) return;
  
  // 使用專門的函數來處理邊界檢測
  const boundaryInfo = checkScrollBoundary(currentEl, deltaY);
  scrollRatio.value = boundaryInfo.ratio;
  
  // 只有當滾動到邊界並且有連續的滾動趨勢時才切換部分
  if (boundaryInfo.atBoundary && hasConsistentScrollDirection(deltaY)) {
    if (deltaY > 0 && currentSection.value < sections.value.length - 1) {
      // 向下滾動到底部
      e.preventDefault(); // 先阻止默認行為
      scrollToNextSection();
    } else if (deltaY < 0 && currentSection.value > 0) {
      // 向上滾動到頂部
      e.preventDefault(); // 先阻止默認行為
      scrollToPrevSection();
    }
  }
};

// 記錄滾動方向以檢測趨勢
const recordScrollDirection = (deltaY) => {
  const now = Date.now();
  
  // 添加新的滾動事件
  scrollEvents.value.push({
    direction: deltaY > 0 ? 'down' : 'up',
    timestamp: now
  });
  
  // 只保留最近1秒內的事件
  scrollEvents.value = scrollEvents.value.filter(event => 
    now - event.timestamp < 1000
  );
};

// 檢查是否有連續的滾動方向
const hasConsistentScrollDirection = (deltaY) => {
  if (scrollEvents.value.length < CONSECUTIVE_SCROLL_COUNT) {
    scrollTrend.value = '不足';
    return false;
  }
  
  // 獲取最近的N次滾動事件
  const recentEvents = scrollEvents.value.slice(-CONSECUTIVE_SCROLL_COUNT);
  
  // 檢查是否都是同一方向
  const expectedDirection = deltaY > 0 ? 'down' : 'up';
  const allSameDirection = recentEvents.every(event => 
    event.direction === expectedDirection
  );
  
  scrollTrend.value = allSameDirection ? expectedDirection : 'mixed';
  return allSameDirection;
};

// 獨立的邊界檢測函數
const checkScrollBoundary = (element, deltaY) => {
  // 根據元素類型選擇合適的滾動內容元素
  let scrollElement = null;
  let projectsGrid = null;
  
  // 針對 ProjectsSection 的特殊處理
  if (element.classList.contains('projects-section')) {
    projectsGrid = element.querySelector('.projects-grid');
    if (projectsGrid) {
      scrollElement = projectsGrid;
    }
  }
  
  // 如果沒有找到特定的滾動元素，使用 section 本身
  if (!scrollElement) {
    scrollElement = element;
  }
  
  // 獲取滾動信息
  const { scrollTop, scrollHeight, clientHeight } = scrollElement;
  
  let ratio = 0;
  let atBoundary = false;
  
  // 根據滾動方向檢查是否到達邊界
  if (deltaY > 0) { // 向下滾動
    // 計算已滾動的比例
    ratio = (scrollTop + clientHeight) / scrollHeight;
    atBoundary = ratio >= SCROLL_THRESHOLD; // 非常接近底部
  } else { // 向上滾動
    ratio = scrollTop / scrollHeight;
    atBoundary = scrollTop <= 1; // 非常接近頂部（允許1像素誤差）
  }
  
  return { atBoundary, ratio };
};

// 滾動到下一區塊
const scrollToNextSection = () => {
  if (currentSection.value < sections.value.length - 1 && !isTransitioning.value) {
    isTransitioning.value = true;
    currentSection.value++;
    
    // 立即隱藏頁面頭尾
    // hideHeaderFooter();
    
    // 重置滾動位置
    resetScrollPosition(currentSection.value);
    
    // 設置過渡完成後的狀態
    setTimeout(() => {
      isTransitioning.value = false;
      scrollEvents.value = []; // 清空滾動事件記錄
      
      // 再次確保頁面完全居中
      centerFullpageContent();
    }, transitionDuration);
  }
};

// 滾動到上一區塊
const scrollToPrevSection = () => {
  if (currentSection.value > 0 && !isTransitioning.value) {
    isTransitioning.value = true;
    currentSection.value--;
    
    // 立即隱藏頁面頭尾
    // hideHeaderFooter();
    
    // 重置滾動位置
    resetScrollPosition(currentSection.value);
    
    // 設置過渡完成後的狀態
    setTimeout(() => {
      isTransitioning.value = false;
      scrollEvents.value = []; // 清空滾動事件記錄
      
      // 再次確保頁面完全居中
      centerFullpageContent();
    }, transitionDuration);
  }
};

// 滾動到指定區塊
const scrollToSection = (index) => {
  if (index !== currentSection.value && !isTransitioning.value) {
    isTransitioning.value = true;
    currentSection.value = index;
    
    // 立即隱藏頁面頭尾
    // hideHeaderFooter();
    
    // 重置滾動位置
    resetScrollPosition(index);
    
    // 設置過渡完成後的狀態
    setTimeout(() => {
      isTransitioning.value = false;
      scrollEvents.value = []; // 清空滾動事件記錄
      
      // 再次確保頁面完全居中
      centerFullpageContent();
    }, transitionDuration);
  }
};

// 重置滾動位置
const resetScrollPosition = (sectionIndex) => {
  setTimeout(() => {
    const section = sections.value[sectionIndex];
    if (section) {
      // 根據不同類型的區塊，重置不同的滾動元素
      if (section.classList.contains('projects-section')) {
        const projectsGrid = section.querySelector('.projects-grid');
        if (projectsGrid) {
          projectsGrid.scrollTop = 0;
          projectsGrid.scrollLeft = 0;
        }
      }
      
      // 嘗試重置本身的滾動位置
      if (section.scrollTo) {
        section.scrollTo(0, 0);
      } else {
        section.scrollTop = 0;
      }
      
      // 確保頁面窗口也重置
      window.scrollTo(0, 0);
    }
  }, 50); // 稍微延遲一下，確保元素可訪問
};

// 隱藏頁面頭尾
const hideHeaderFooter = () => {
  const header = document.querySelector('header.header');
  const footer = document.querySelector('footer.footer');
  
  if (header) {
    header.style.display = 'none';
  }
  
  if (footer) {
    footer.style.display = 'none';
  }
  
  // 確保窗口滾動到頂部
  window.scrollTo(0, 0);
};

// 確保全頁內容居中顯示
const centerFullpageContent = () => {
  nextTick(() => {
    // 使用 composable 的方法替代直接設置
    disableScrolling();
    
    // 確保窗口滾動到頂部
    window.scrollTo(0, 0)
  });
};

// 觸摸事件處理
let touchStartY = 0;
let touchStartTime = 0;

const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
};

const handleTouchMove = (e) => {
  // 如果正在過渡中，阻止所有觸摸事件
  if (isTransitioning.value) {
    e.preventDefault();
    return;
  }
  
  const touchY = e.touches[0].clientY;
  const touchTime = Date.now() - touchStartTime;
  const diff = touchStartY - touchY;
  
  // 只處理明確的快速滑動手勢
  const isQuickSwipe = Math.abs(diff) > 80 && touchTime < 300;
  
  if (isQuickSwipe) {
    const currentEl = sections.value[currentSection.value];
    
    if (currentEl) {
      // 獲取觸摸時的邊界情況
      const boundaryInfo = checkScrollBoundary(currentEl, diff);
      
      if (boundaryInfo.atBoundary) {
        if (diff > 0 && currentSection.value < sections.value.length - 1) {
          e.preventDefault();
          scrollToNextSection();
        } else if (diff < 0 && currentSection.value > 0) {
          e.preventDefault();
          scrollToPrevSection();
        }
      }
    }
  }
};

// 鍵盤事件處理
const handleKeyDown = (e) => {
  if (isTransitioning.value) return;
  
  // 上下箭頭鍵或翻頁鍵
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    if (currentSection.value < sections.value.length - 1) {
      e.preventDefault();
      scrollToNextSection();
    }
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    if (currentSection.value > 0) {
      e.preventDefault();
      scrollToPrevSection();
    }
  }
};

// 添加窗口重調大小事件處理
const handleResize = () => {
  // 重置當前section的滾動位置
  resetScrollPosition(currentSection.value);
  // 重新居中內容
  centerFullpageContent();
};

// 生命週期鉤子
onMounted(() => {
  disableScrolling();
  // 獲取所有 section 元素
  sections.value = document.querySelectorAll('.fullpage-section');
  
  // 添加事件監聽器
  window.addEventListener('wheel', handleScroll, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('keydown', handleKeyDown, { passive: false });
  window.addEventListener('resize', handleResize);
  
  // 確保初始頁面位於頂部並隱藏頭尾
  // hideHeaderFooter();
  resetScrollPosition(currentSection.value);
  centerFullpageContent();
});

// 清理事件監聽器
onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleScroll);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('resize', handleResize);

  enableScrolling();
});
</script>

<style scoped>
.fullpage-container {
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  background-color: var(--background-color);
}

.fullpage-section {
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease, visibility 0.6s ease;
  scroll-snap-align: start;
}

.fullpage-section.active {
  opacity: 1;
  visibility: visible;
  z-index: 1;
}

/* 區塊指示器 */
.section-indicator {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}

.indicator-dot:hover {
  background-color: var(--primary-color);
  opacity: 0.8;
}

/* 調試信息面板 */
.debug-info {
  position: fixed;
  left: 10px;
  bottom: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 1000;
}
</style>