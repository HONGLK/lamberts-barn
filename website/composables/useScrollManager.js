import { onMounted, onBeforeUnmount } from 'vue';

export function useScrollManager() {
  const enableScrolling = () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.userSelect = '';
    document.body.classList.remove('has-fullpage');

    const allScrollableElements = document.querySelectorAll('.scrollable');
    allScrollableElements.forEach(el => {
      el.style.overflow = '';
    });
  };
  
  const disableScrolling = () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('has-fullpage');
  };
  
  onMounted(() => {
  });
  
  onBeforeUnmount(() => {
    enableScrolling();
  });
  
  return {
    enableScrolling,
    disableScrolling
  };
}