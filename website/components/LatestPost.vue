<template>
    <section class="latest-posts">
      <div class="section-header">
        <h2 class="section-title">{{ $t('latest_posts') }}</h2>
        <NuxtLink :to="localePath('/blog')" class="view-all">
          {{ $t('all_posts') }}
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </NuxtLink>
      </div>
      
      <div v-if="loading" class="loading-spinner">
        <font-awesome-icon :icon="['fas', 'spinner']" spin />
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="latestPosts.length === 0" class="no-posts">
        <p>暫無文章</p>
      </div>
      
      <div v-else class="posts-grid">
        <BlogCard 
          v-for="post in latestPosts" 
          :key="post.id" 
          :article="post" 
        />
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const { t } = useI18n()
  const localePath = useLocalePath()
  
  const latestPosts = ref([])
  const loading = ref(true)
  const error = ref(null)
  
  const fetchLatestPosts = async () => {
    try {
      loading.value = true
      const { data } = await useStrapiClient().find('articles', {
        populate: ['image', 'category'],
        sort: ['publishedAt:desc'],
        pagination: {
          page: 1,
          pageSize: 3
        }
      })
      latestPosts.value = data
      loading.value = false
    } catch (err) {
      error.value = '無法載入最新文章'
      loading.value = false
      console.error('Error fetching latest posts:', err)
    }
  }
  
  onMounted(() => {
    fetchLatestPosts()
  })
  </script>
  
  <style scoped>
  .latest-posts {
    margin: 4rem 0;
    padding: 0 1rem;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .section-title {
    color: var(--primary-color);
    margin: 0;
  }
  
  .view-all {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .view-all:hover {
    color: var(--primary-color);
    gap: 0.8rem;
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 2rem;
    color: var(--primary-color);
  }
  
  .error-message, .no-posts {
    text-align: center;
    padding: 2rem;
    background-color: var(--surface-color);
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>