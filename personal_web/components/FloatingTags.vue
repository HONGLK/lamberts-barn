<template>
    <div class="floating-tags">
      <span 
        class="tag" 
        v-for="(tag, index) in tags" 
        :key="index" 
        :style="tagStyles[index]"
        :class="{ 'lambert-tag': tag === 'Lambert' }"
      >
        #{{ tag }}
      </span>
    </div>
</template>
  
<script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const props = defineProps({
    tags: {
      type: Array,
      required: true
    }
  })
  
  const gridSize = computed(() => Math.ceil(Math.sqrt(props.tags.length)))
  
  const tagStyles = ref([])
  
  const getTagStyle = (index) => {
    const row = Math.floor(index / gridSize.value)
    const col = index % gridSize.value
    const cellWidth = 100 / gridSize.value
    const cellHeight = 100 / gridSize.value
  
    return {
      fontSize: `${Math.random() * (1.5 - 1) + 1}em`,
      top: `${row * cellHeight / 1.2 + Math.random() * cellHeight / 1.2 + 10}%`,
      left: `${col * cellWidth/1.2 + Math.random() * cellWidth/1.5}%`,
      opacity: Math.random() * (1 - 0.5) + 0.5,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 1}s`
    }
  }
  
  onMounted(() => {
    tagStyles.value = props.tags.map((_, index) => getTagStyle(index))
  })
</script>
  
<style scoped>
  .floating-tags {
    flex: 1;
    position: relative;
    height: 100vh;
    width: 50%;
  }
  
  .tag {
    position: absolute;
    color: var(--secondary-color);
    font-weight: bold;
    opacity: 0.7;
    transition: all 0.3s ease;
    white-space: nowrap;
    animation-name: float;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;
  }
  
  @keyframes float {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(5px, 5px);
    }
  }
  
  .lambert-tag {
    color: var(--primary-color);
    font-weight: bold;
    opacity: 1;
  }
  
  .tag:hover {
    transform: scale(1.1);
    opacity: 1;
  }
  </style>