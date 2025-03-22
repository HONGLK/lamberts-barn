<template>
  <div class="article-container">
    <div v-if="loading" class="loading-spinner">
      <font-awesome-icon :icon="['fas', 'spinner']" spin />
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <NuxtLink :to="localePath('/blog')" class="back-link">
        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        返回文章列表
      </NuxtLink>
    </div>

    <template v-else-if="article">
      <div class="article-header">
        <div v-if="article.category" class="article-category">
          {{ article.category.Name }}
        </div>
        <h1 class="article-title">{{ article.Title }}</h1>
        <div class="article-meta">
          <div class="meta-item">
            <font-awesome-icon :icon="['fas', 'calendar']" />
            <span>{{ formatDate(article.PublishedDate) }}</span>
          </div>
          <div v-if="article.author" class="meta-item">
            <font-awesome-icon :icon="['fas', 'user']" />
            <span>{{ article.author.Name }}</span>
          </div>
        </div>
      </div>

      <!-- 渲染 Markdown 內容 -->
      <div class="article-content" v-html="renderedMarkdown"></div>

      <div class="article-footer">
        <NuxtLink :to="localePath('/blog')" class="back-link">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
          返回文章列表
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRuntimeConfig } from "#app";
import { useLocalePath } from "#imports";
import MarkdownIt from "markdown-it";
import MarkdownItAnchor from "markdown-it-anchor";
import MarkdownItReplaceLink from "markdown-it-replace-link";
import hljs from "highlight.js";
import sanitizeHtml from "sanitize-html";
import "highlight.js/styles/github-dark.css";

const route = useRoute();
const localePath = useLocalePath();
const loading = ref(true);
const error = ref(null);
const article = ref(null);
const renderedMarkdown = ref("");

const articleId = route.params.documentId;
const strapiUrl = useRuntimeConfig().public.strapi.url;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs language-${lang}"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang }).value
        }</code></pre>`;
      } catch (err) {
        // console.error("Highlight error:", err);
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
})
  .use(MarkdownItAnchor, {
    permalink: MarkdownItAnchor.permalink.linkInsideHeader({
      symbol: `<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.0545407 15.017C-0.226368 16.3169 0.605513 17.5997 1.9126 17.8821C1.93375 17.8867 1.95489 17.891 1.97602 17.895C2.08941 17.9299 2.20705 17.9483 2.32767 17.9483H11.4611C12.3859 17.9483 13.1356 16.8667 13.1356 15.5324C13.1356 14.1981 12.3859 13.1164 11.4611 13.1164H5.41965L7.56226 3.20134C7.84317 1.90142 7.01129 0.618646 5.7042 0.33619C4.39712 0.0537336 3.10979 0.878556 2.82888 2.17848L0.0545407 15.017ZM4.06845 13.1164L6.27134 2.92238C6.39903 2.33151 6.0209 1.74843 5.42677 1.62004C4.83264 1.49165 4.24749 1.86657 4.11981 2.45744L1.78882 13.2443C1.95792 13.1614 2.13916 13.1164 2.32767 13.1164H2.49204L4.76527 2.59692C4.81634 2.36057 5.0504 2.21061 5.28805 2.26196C5.5257 2.31332 5.67695 2.54655 5.62588 2.7829L3.39284 13.1164H4.06845ZM3.10808 14.4342H3.78368L3.64129 15.0931H2.96569L3.10808 14.4342ZM2.20417 14.4486C1.84255 14.5337 1.56655 14.9866 1.56655 15.5324C1.56655 16.0062 1.77455 16.41 2.066 16.5639C2.10617 16.5776 2.14755 16.5891 2.19003 16.5983C2.70994 16.7106 3.22297 16.4376 3.4286 15.9716H2.32767C2.24019 15.9716 2.16133 15.9184 2.10579 15.8332C2.0067 15.7315 1.9588 15.584 1.99092 15.4354L2.20417 14.4486ZM4.57685 16.6305C4.67074 16.4478 4.74249 16.25 4.78792 16.0398L4.80265 15.9716H11.4611C11.6293 15.9716 11.7656 15.775 11.7656 15.5324C11.7656 15.2898 11.6293 15.0931 11.4611 15.0931H4.9925L5.13488 14.4342H11.4611C11.8815 14.4342 12.2222 14.9259 12.2222 15.5324C12.2222 16.1389 11.8815 16.6305 11.4611 16.6305H4.57685Z" fill="currentColor"/>
</svg>
`,
      class: 'header-anchor',
      renderAttrs: (slug) => ({ 'aria-label': `連結到 "${slug}"` })
    })
  })
  .use(MarkdownItReplaceLink, {
    replaceLink: function(link) {
      // 處理圖片路徑
      if (link && !link.startsWith('http') && !link.startsWith('https') && !link.startsWith('/')) {
        return `${strapiUrl}/${link}`;
      } else if (link && link.startsWith('/')) {
        return `${strapiUrl}${link}`;
      }
      return link;
    }
  });

// 安全配置
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 
    'em', 'strong', 'del', 's', 'svg', 'path'
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    code: ['class', 'spellcheck'],
    pre: ['class'],
    a: ['href', 'name', 'target', 'rel', 'aria-label', 'class'],
    svg: ['width', 'height', 'viewBox', 'fill', 'xmlns'],
    path: ['d', 'fill', 'fill-rule', 'clip-rule'],
    '*': ['class']
  }
};

// 從 Strapi 抓取文章
const fetchArticle = async () => {
  try {
    loading.value = true;
    
    const response = await fetch(`${strapiUrl}/api/articles/${articleId}?populate=*`);
    const result = await response.json();

    if (!result.data) {
      throw new Error("文章不存在或無法載入");
    }

    article.value = result.data;

    // 渲染 Markdown 內容
    renderedMarkdown.value = sanitizeHtml(
      md.render(article.value.Content),
      sanitizeOptions
    );

    loading.value = false;
    
    // 設置頁面標題
    useHead({
      title: article.value.Title,
      meta: [{ name: "description", content: article.value.Description }],
    });
  } catch (err) {
    error.value = "無法載入文章，請稍後再試";
    loading.value = false;
    // console.error("Error fetching article:", err);
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

onMounted(() => {
  fetchArticle();
});
</script>

<style>
/* 不使用 scoped，確保樣式應用到動態渲染的內容 */
.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Noto Sans TC', 'Roboto', sans-serif;
  background-color: var(--bg-primary, #ffffff);
  color: var(--text-primary, #333333);
}

.article-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color, #2c3e50);
  text-align: center;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  color: var(--text-secondary, #666666);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-category {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.article-category span {
  background-color: var(--primary-color, #2c3e50);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.article-content {
  line-height: 1.8;
  color: var(--text-primary, #333333);
  font-size: 1.1rem;
  padding-bottom: 2rem;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  color: var(--primary-color, #2c3e50);
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
  position: relative;
  padding-left: 25px;
}

.article-content h1 {
  font-size: 2.2rem;
  text-align: center;
  padding-left: 0; /* 中心對齊的標題不需要左邊距 */
}

.article-content h1 .header-anchor {
  /* 針對置中的 h1，錨點放在左側 */
  position: absolute;
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
}

.article-content h2 {
  font-size: 1.75rem;
  border-bottom: 2px solid var(--divider-color, #eaecef);
  padding-bottom: 0.5rem;
}

.article-content h3 {
  font-size: 1.5rem;
}

/* 段落樣式 */
.article-content p {
  margin-bottom: 1.2rem;
}

/* 引用區塊 */
.article-content blockquote {
  font-style: italic;
  border-left: 4px solid var(--divider-color, #eaecef);
  padding-left: 1rem;
  margin: 1.5rem 0;
  background: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 4px;
}

/* 程式碼區塊 */
.article-content pre {
  background-color: var(--surface-color, #1e1e1e) !important;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  margin: 1.5rem 0;
}

.article-content pre code {
  font-family: 'Fira Code', 'Consolas', monospace;
  padding: 0 !important;
  color: var(--code-text, #eeeeee) !important;
  background-color: transparent !important;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* 程式碼 */
.article-content code {
  font-family: 'Fira Code', 'Consolas', monospace;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: var(--accent, #e96900);
  font-size: 0.9em;
}

/* 表格樣式 */
.article-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  border: 1px solid var(--divider-color, #eaecef);
  overflow-x: auto;
  display: block;
}

.article-content table th,
.article-content table td {
  border: 1px solid var(--divider-color, #eaecef);
  padding: 0.75rem;
  text-align: left;
}

.article-content table th {
  background-color: var(--surface-color, #f8f8f8);
  font-weight: bold;
}

.article-content table tr:nth-child(2n) {
  background-color: var(--table-alt-row, #f8f8f8);
}

/* 圖片樣式 */
.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 1.5rem auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 超連結樣式 */
.article-content a {
  color: var(--accent, #3498db);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.article-content a:hover {
  color: var(--secondary-color, #2980b9);
  text-decoration: none;
}

/* 列表樣式 */
.article-content ul,
.article-content ol {
  padding-left: 2rem;
  margin: 1rem 0;
}

.article-content li {
  margin-bottom: 0.5rem;
}

/* 分隔線 */
.article-content hr {
  border: none;
  border-top: 1px solid var(--divider-color, #eaecef);
  margin: 2rem 0;
}

/* 頁尾樣式 */
.article-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--divider-color, #eaecef);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color, #2c3e50);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--accent, #3498db);
}

/* 載入動畫 */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 2rem;
  color: var(--primary-color, #2c3e50);
}

/* 錯誤訊息 */
.error-message {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}

/* 錨點樣式 */
.header-anchor {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary, #757575);
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}

.article-content h2:hover .header-anchor,
.article-content h3:hover .header-anchor,
.article-content h4:hover .header-anchor,
.article-content h5:hover .header-anchor,
.article-content h6:hover .header-anchor {
  opacity: 0.7;
}

.article-content h1:hover .header-anchor {
  opacity: 0.7;
}

.header-anchor:hover {
  opacity: 1 !important;
  color: var(--accent, #3498db);
}

/* 確保 SVG 圖標垂直居中 */
.header-anchor svg {
  vertical-align: middle;
  display: block;
}

/* 適應深色模式 */
@media (prefers-color-scheme: dark) {
  .article-content code {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--accent-dark, #ff7e35);
  }
  
  .article-content table th {
    background-color: var(--surface-color-dark, #2d2d2d);
  }
  
  .article-content table tr:nth-child(2n) {
    background-color: var(--table-alt-row-dark, #2d2d2d);
  }
  
  .header-anchor {
    color: var(--text-secondary-dark, #9e9e9e);
  }
  
  .header-anchor:hover {
    color: var(--accent-dark, #64b5f6);
  }
}
</style>