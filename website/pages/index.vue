<template>
  <div
    class="fullpage-container"
    tabindex="0"
    @wheel.prevent="handleWheel"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @keydown="handleKeyDown"
  >
    <!-- 所有區塊包裹在 wrapper 中，依據 currentSection 切換顯示 -->
    <div
      class="sections-wrapper"
      :style="{ transform: `translateY(-${currentSection * 100}vh)` }"
    >
      <IntroSection
        :fullText="fullText"
        :fullDescription="fullDescription"
        :tags="tags"
      />
      <ProjectsSection :projects="projects" />
      <!-- sections -->
    </div>

    <!-- 區塊指示器 -->
    <div class="section-indicator">
      <div
        v-for="index in sectionsCount"
        :key="index"
        :class="{ active: currentSection === index - 1 }"
        @click="goToSection(index - 1)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import IntroSection from '~/components/IntroSection.vue'
import ProjectsSection from '~/components/ProjectsSection.vue'
import { useI18n } from '#imports'
import { zhProjects, enProjects } from '~/data/projects'
import { zhTags, enTags } from '~/data/tags'

// 資料設定
const fullText = "您好！\n\n歡迎來到我的個人網站"
const fullDescription = "我是 Lambert，一名對IoT技術、人工智慧熱忱且將其融入生活的全端工程師\n誠如我的個人Logo，結合藍色與橘色，藍色代表科技，橘色代表熱忱。\nLambert's Barn 一點一點累積了這一路上的汗水、歡笑與坑洞，成為現在的我。"
// const tags = [
//   'Lambert',
//   '台灣',
//   '旅行',
//   '技術狂熱',
//   '學無止境',
//   '閱讀',
//   '行動派',
//   '美食探索者',
//   '孩子的爸爸',
//   '斜槓青年',
//   '知識分享者'
// ]

const { locale } = useI18n()
const projects = computed(() =>
  locale.value === 'zh-TW' ? zhProjects : enProjects
)
const tags = computed(() => 
  locale.value === 'zh-TW' ? zhTags : enTags
)

// 區塊控制
const currentSection = ref(0)
const sectionsCount = 2 // 需手動根據實際 section 數量更新

// 防止多次觸發過渡效果
let isTransitioning = false
const transitionDuration = 600 // 單位：ms，與 CSS transition 時間一致

// 滾輪事件處理
const handleWheel = (e) => {
  if (isTransitioning) return
  const delta = e.deltaY
  if (delta > 0) {
    nextSection()
  } else if (delta < 0) {
    prevSection()
  }
}

// 移動到下一區塊
const nextSection = () => {
  if (currentSection.value < sectionsCount - 1) {
    changeSection(currentSection.value + 1)
  }
}

// 移動到上一區塊
const prevSection = () => {
  if (currentSection.value > 0) {
    changeSection(currentSection.value - 1)
  }
}

// 統一處理區塊切換，並設置過渡鎖定
const changeSection = (newIndex) => {
  isTransitioning = true
  currentSection.value = newIndex
  setTimeout(() => {
    isTransitioning = false
  }, transitionDuration)
}

// 點擊指示器切換
const goToSection = (index) => {
  if (!isTransitioning && index !== currentSection.value) {
    changeSection(index)
  }
}

// 觸控事件處理
let touchStartY = 0
const handleTouchStart = (e) => {
  touchStartY = e.touches[0].clientY
}
const handleTouchEnd = (e) => {
  const touchEndY = e.changedTouches[0].clientY
  const diff = touchStartY - touchEndY
  if (Math.abs(diff) < 50) return // 忽略過短的滑動
  diff > 0 ? nextSection() : prevSection()
}

// 鍵盤事件處理
const handleKeyDown = (e) => {
  if (isTransitioning) return
  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    nextSection()
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    prevSection()
  }
}
</script>

<style scoped>
.fullpage-container {
  height: 100vh;
  overflow: hidden;
  position: relative;
  outline: none; /* 移除焦點邊框 */
}

.sections-wrapper {
  height: 100%;
  transition: transform 0.6s ease;
}

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

.section-indicator div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.section-indicator div.active {
  background-color: var(--primary-color);
  transform: scale(1.2);
}
</style>
