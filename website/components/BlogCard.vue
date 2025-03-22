<template>
  <NuxtLink :to="localePath(`/blog/${article.documentId}`)" class="blog-card">
    <div class="card-image-container">
      <img 
        v-if="featuredImage" 
        :src="featuredImage" 
        :alt="article.Title" 
        class="card-image"
      />
      <div v-else class="placeholder-image">
        <span class="material-symbols-outlined">image</span>
      </div>
      <div v-if="category" class="category-badge">
        #{{ category }}
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ article.Title }}</h3>
      
      <p class="card-description">{{ article.Description || '' }}</p>
      
      <div class="card-meta">
        <div class="meta-date">
          <font-awesome-icon :icon="['fas', 'calendar']" />
          <span>{{ formatDate(article.PublishedDate) }}</span>
        </div>
        
        <div class="read-more">
          <span class="material-symbols-outlined">arrow_forward</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const { t } = useI18n();
const localePath = useLocalePath();

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

// 取得文章封面圖片
const featuredImage = computed(() => {
  if (props.article.Image) {
    const baseUrl = useRuntimeConfig().public.strapi.url || 'http://localhost:1337';
    return `${baseUrl}${props.article.Image.url}`;
  }
  return null;
});

// 取得文章分類
const category = computed(() => {
  if (props.article.category) {
    return props.article.category.Name;
  }
  return null;
});
  
// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(useI18n().locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
</script>

<style scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: var(--surface-color);
  height: 100%;
  text-decoration: none;
  color: var(--on-surface-color);
}

.blog-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: rgba(30, 30, 30, 0.8);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.blog-card:hover .card-image {
  transform: scale(1.05);
}

.placeholder-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: var(--disabled-color);
}

.placeholder-image .material-symbols-outlined {
  font-size: 3rem;
}

.category-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: rgba(80, 80, 80, 0.7);
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  line-height: 1.4;
  font-family: 'Noto Sans TC', sans-serif;
}

.card-description {
  margin-bottom: 1rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Noto Sans TC', sans-serif;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--divider-color);
  padding-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.meta-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.read-more {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  transition: transform 0.2s ease;
}

.read-more .material-symbols-outlined {
  font-size: 1.2rem;
}

.blog-card:hover .read-more {
  transform: translateX(3px);
}

@media (max-width: 768px) {
  .card-image-container {
    height: 180px;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-description {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }
}

@media (max-width: 480px) {
  .card-image-container {
    height: 160px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-meta {
    font-size: 0.8rem;
  }
}
</style>
