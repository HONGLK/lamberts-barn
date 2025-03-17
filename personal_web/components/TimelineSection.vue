<template>
  <section class="fullpage-section timeline scrollable">
    <div class="content">
      <h2>我的歷程</h2>
      <div class="timeline-container">
        <div v-for="(event, index) in timelineEvents" :key="index" class="timeline-item" :class="{ 'right': index % 2 !== 0 }">
          <div class="timeline-content">
            <h3>{{ event.year }}</h3>
            <h4>{{ event.title }}</h4>
            <p>{{ event.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<script setup>
  import { ref } from 'vue'
  
  const timelineEvents = ref([
    {
      year: '2020',
      title: '全端工程師',
      description: '加入某科技公司，負責開發和維護企業級應用。'
    },
    {
      year: '2018',
      title: 'IoT 專案負責人',
      description: '領導一個創新的物聯網項目，整合 AI 技術。'
    },
    {
      year: '2016',
      title: '軟體工程師',
      description: '開始專業軟體開發生涯，主要專注於後端開發。'
    },
    {
      year: '2014',
      title: '大學畢業',
      description: '獲得資訊工程學士學位，開始了解 AI 和 IoT 技術。'
    }
  ])

  const props = defineProps({
    isLastSection: {
      type: Boolean,
      default: false
    }
  })
</script>
  
<style scoped>
.timeline {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  color: var(--on-background-color);
}

.content {
  flex: 1;
  /* overflow-y: auto; */
  width: 100vw;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 40px;
}

.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-container::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: var(--primary-color);
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -3px;
}

.timeline-item {
  padding: 10px 40px;
  position: relative;
  background-color: inherit;
  width: 50%;
}

.timeline-item::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  right: -17px;
  background-color: var(--surface-color);
  border: 4px solid var(--primary-color);
  top: 15px;
  border-radius: 50%;
  z-index: 1;
}

.right {
  left: 50%;
}

.right::after {
  left: -16px;
}

.timeline-content {
  padding: 20px 30px;
  background-color: var(--surface-color);
  position: relative;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h3 {
  color: var(--primary-color);
  margin-bottom: 5px;
}

h4 {
  color: var(--secondary-color);
  margin-bottom: 10px;
}

p {
  margin: 0;
}

@media screen and (max-width: 600px) {
  .timeline-container::after {
    left: 31px;
  }
  
  .timeline-item {
    width: 100%;
    padding-left: 70px;
    padding-right: 25px;
  }
  
  .timeline-item::after {
    left: 15px;
  }
  
  .right {
    left: 0%;
  }
}
</style>