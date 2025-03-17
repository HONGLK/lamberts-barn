<template>
  <div class="site-layout">
    <AppHeader />
    
    <main class="main-content">
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';

const headerRef = ref(null);
const footerRef = ref(null);
provide('headerElement', headerRef);
provide('footerElement', footerRef);
</script>