<template>
  <div class="scroll-indicator">
    <span class="material-symbols-outlined animate-bounce">expand_more</span>
  </div>
</template>

<script setup>

</script>

<style scoped>
.scroll-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--primary-color);
  cursor: pointer;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>