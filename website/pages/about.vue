<template>
  <div class="about-page">
    <!-- 頁面標題：根據當前語系顯示中文或英文 -->
    <h1 class="page-title">{{ $t('aboutTitle') }}</h1>
  
    <!-- 個人資訊區塊 -->
    <div class="about-section">
      <div class="profile-container">
        <div class="profile-image-container">
          <img src="/logo.png" alt="Lambert" class="profile-image"/>
        </div>
        <div class="profile-details">
          <h2>Lambert</h2>
          <p class="profile-tagline">{{ aboutText.tagline }}</p>
          <div class="profile-description" v-html="aboutText.description"></div>
        </div>
      </div>
    </div>
  
    <!-- 技能區塊 -->
    <div class="about-section">
      <h2 class="section-title">{{ aboutText.skills.title }}</h2>
      <div class="skills-container">
        <div v-for="(skill, index) in aboutText.skills.items" :key="index" class="skill-item">
          <span class="material-symbols-outlined">{{ skill.icon }}</span>
          <div class="skill-info">
            <h3>{{ skill.name }}</h3>
            <p>{{ skill.description }}</p>
          </div>
        </div>
      </div>
    </div>
  
    <!-- 聯絡資訊區塊 -->
    <div class="about-section">
      <h2 class="section-title">{{ aboutText.contact.title }}</h2>
      <div class="contact-container">
        <a href="mailto:lambert@example.com" class="contact-link">
          <font-awesome-icon :icon="['fas', 'envelope']" />
          <span>lambert@example.com</span>
        </a>
        <a href="https://www.linkedin.com/in/lambert" target="_blank" rel="noopener" class="contact-link">
          <font-awesome-icon :icon="['fab', 'linkedin']" />
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/lambert" target="_blank" rel="noopener" class="contact-link">
          <font-awesome-icon :icon="['fab', 'github']" />
          <span>GitHub</span>
        </a>
        <a href="https://t.me/lambert" target="_blank" rel="noopener" class="contact-link">
          <font-awesome-icon :icon="['fab', 'telegram']" />
          <span>Telegram</span>
        </a>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { computed } from 'vue';
import { useI18n } from '#imports';
import { zhAbout, enAbout } from '~/data/about';
  
const { locale } = useI18n();
  
// 根據當前語系選擇對應的文本
const aboutText = computed(() => 
  locale.value === 'zh-TW' ? zhAbout : enAbout
);
</script>
  
<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about-section {
  margin-bottom: 3rem;
  background-color: var(--surface-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.section-title {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background-color: var(--primary-color);
}

/* 個人資訊區塊 */
.profile-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.profile-image-container {
  flex: 0 0 125px;
  height: 125px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  position: relative;
}

.profile-image {
width: 100%;
height: 100%;
object-fit: contain;
padding: 16px;
}

.profile-details {
  flex: 1;
}

.profile-details h2 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.profile-tagline {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.profile-description {
  line-height: 1.8;
  white-space: pre-line;
}

/* 技能區塊 */
.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.skill-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.skill-item:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.skill-item .material-symbols-outlined {
  font-size: 2rem;
  color: var(--primary-color);
}

.skill-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.skill-info p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* 聯絡資訊區塊 */
.contact-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-link:hover {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
  transform: translateY(-3px);
}

.contact-link svg {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-image-container {
    margin: 0 auto;
  }
  
  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .skills-container {
    grid-template-columns: 1fr;
  }
  
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>