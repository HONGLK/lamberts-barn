import { onMounted, onBeforeUnmount } from 'vue';

export function useScrollManager() {
  // 啟用頁面滾動
  const enableScrolling = () => {
    // 重置全局滾動樣式
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.userSelect = '';
    document.body.classList.remove('has-fullpage');
    
    // 清理任何可能影響滾動的其他樣式
    const allScrollableElements = document.querySelectorAll('.scrollable');
    allScrollableElements.forEach(el => {
      el.style.overflow = '';
    });
  };
  
  // 禁用頁面滾動 (全頁模式用)
  const disableScrolling = () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.classList.add('has-fullpage');
  };
  
  // 在元件掛載時自動啟用滾動
  onMounted(() => {
    // 默認啟用滾動，除非特別指定
  });
  
  // 在元件卸載前確保啟用滾動
  onBeforeUnmount(() => {
    enableScrolling();
  });
  
  return {
    enableScrolling,
    disableScrolling
  };
}