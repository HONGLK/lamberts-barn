<template>
  <div class="blog-container">
    <h1 class="page-title">{{ $t('blog') }}</h1>
    
    <div class="blog-filters">
      <div class="search-box">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          :placeholder="$t('search')" 
          class="search-input"
        />
      </div>
      
      <div v-if="categories.length" class="category-filter">
        <label>{{ $t('categories') }}:</label>
        <select v-model="selectedCategory" class="category-select">
          <option value="">{{ $t('all_posts') }}</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.Name }}
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading-spinner">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="filteredArticles.length === 0" class="no-posts">
      <p>暫無文章</p>
    </div>
    
    <div v-else class="blog-list">
      <BlogCard 
        v-for="article in filteredArticles" 
        :key="article.documentId" 
        :article="article" 
      />
    </div>
    
    <div v-if="filteredArticles.length > postsPerPage" class="pagination">
      <button 
        v-for="page in totalPages" 
        :key="page" 
        @click="currentPage = page" 
        :class="{ active: currentPage === page }"
        class="page-button"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

useHead({
  title: 'Blog'
});

// 狀態
const articles = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const postsPerPage = 6;

const config = useRuntimeConfig();
const API_BASE_URL = config.public.strapi.url || 'http://localhost:1337';

// 從 Strapi 抓取文章
const fetchArticles = async () => {
  try {
    loading.value = true;
    const response = await fetch(`${API_BASE_URL}/api/articles?populate=*`);
    const { data } = await response.json();

    articles.value = data;    
    loading.value = false;
    
  } catch (err) {
    error.value = '無法載入文章，請稍後再試';
    loading.value = false;
    console.error('Error fetching articles:', err);
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    const { data } = await response.json();
    
    categories.value = data;

  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

// 篩選文章
const filteredArticles = computed(() => {
  console.log(filteredArticles)
  let result = articles.value;

  // 搜尋篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(article =>
      article.Title.toLowerCase().includes(query) || 
      (article.Description && article.Description.toLowerCase().includes(query))
    );
  }

  // 分類篩選
  if (selectedCategory.value) {
    result = result.filter(article => 
      article.category && 
      article.category.id === parseInt(selectedCategory.value)
    );
  }

  // 分頁
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return result.slice(startIndex, endIndex);
});

// 計算總頁數
const totalPages = computed(() => {
  const filtered = articles.value.filter(article => {
    // 搜尋篩選
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      if (!article.attributes.title.toLowerCase().includes(query) && 
          !article.attributes.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // 分類篩選
    if (selectedCategory.value) {
      if (!article.attributes.category || 
          !article.attributes.category.data || 
          article.attributes.category.data.id !== parseInt(selectedCategory.value)) {
        return false;
      }
    }
    
    return true;
  });
  
  return Math.ceil(filtered.length / postsPerPage);
});

// 重置分頁當篩選條件改變
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchArticles();
  fetchCategories();
});
</script>

<style scoped>
.blog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.blog-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 8px;
  border: 1px solid var(--divider-color);
  background-color: var(--surface-color);
  color: var(--on-surface-color);
}

.category-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--divider-color);
  background-color: var(--surface-color);
  color: var(--on-surface-color);
}

.blog-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 2rem;
  color: var(--primary-color);
}

.error-message, .no-posts {
  text-align: center;
  padding: 2rem;
  background-color: var(--surface-color);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.page-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-color);
  color: var(--on-surface-color);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-button:hover {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}

.page-button.active {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}

@media (max-width: 768px) {
  .blog-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-filter {
    width: 100%;
  }
  
  .category-select {
    flex: 1;
  }
}
</style>