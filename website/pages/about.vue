<template>
  <div class="about-page">
    <h1 class="page-title">{{ $t('aboutTitle') }}</h1>
  
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
  
    <div class="about-section">
      <h2 class="section-title">{{ aboutText.skills.title }}</h2>
      <div class="skills-container">
        <div v-for="(skill, index) in aboutText.skills.items" :key="index" class="skill-item">
          <span class="material-symbols-outlined">{{ skill.icon }}</span>
          <div class="skill-info">
            <h3>{{ skill.name }}</h3>
            <p style="white-space: pre-line;" >{{ skill.description }}</p>
          </div>
        </div>
      </div>
    </div>
  
    <div class="about-section">
      <h2 class="section-title">{{ aboutText.technologies?.title || '技術工具' }}</h2>
      <div class="tech-categories">
        <div v-for="(category, catIndex) in technologies" :key="`cat-${catIndex}`" class="tech-category">
          <h3 class="category-title">{{ category.name }}</h3>
          <div class="tech-icons-container">
            <div v-for="(tech, techIndex) in category.items" :key="`tech-${techIndex}`" class="tech-item">
              <Icon
                :icon="getTechIcon(tech)"
                :title="tech"
                class="tech-icon"
              />
              <span class="tech-name">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="about-section">
      <h2 class="section-title">{{ aboutText.contact.title }}</h2>
      <div class="contact-container">
        <a href="mailto:lambert76.chen@gmail.com?subject=Hello_Lambert" class="contact-link">
          <font-awesome-icon :icon="['fas', 'envelope']" />
          <span>Lambert</span>
        </a>
        <a href="https://www.linkedin.com/in/lambert76-chen" target="_blank" rel="noopener" class="contact-link">
          <font-awesome-icon :icon="['fab', 'linkedin']" />
          <span>LinkedIn</span>
        </a>
        <a href="https://github.com/HONGLK" target="_blank" rel="noopener" class="contact-link">
          <font-awesome-icon :icon="['fab', 'github']" />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { computed } from 'vue';
import { useI18n } from '#imports';
import { zhAbout, enAbout } from '~/data/about';
import { zhTechnologies, enTechnologies } from '~/data/technologies';
import { Icon } from '@iconify/vue';
  
useHead({
  title: 'About'
});

const { locale } = useI18n();
  
// 根據當前語系選擇對應的文本
const aboutText = computed(() => 
  locale.value === 'zh-TW' ? zhAbout : enAbout
);

// 根據當前語系選擇對應的技術資料
const technologies = computed(() => 
  locale.value === 'zh-TW' ? zhTechnologies : enTechnologies
);

// 取得技術圖標
const getTechIcon = (tech) => {
  const techIcons = {
    // 程式語言
    'JavaScript': 'vscode-icons:file-type-js',
    'Python': 'material-icon-theme:python',
    'Golang': 'devicon:go-wordmark',
    'Dart': 'devicon:dart',
    'C#': 'devicon:csharp',
    
    // 前端技術
    'Vue.js': 'skill-icons:vuejs-light',
    'Nuxt': 'vscode-icons:file-type-nuxt',
    'Figma': 'material-icon-theme:figma',
    
    // 後端框架
    'FastAPI': 'devicon:fastapi',
    'Flask': 'simple-icons:flask',
    'Django': 'material-icon-theme:django',
    'Node.js': 'vscode-icons:file-type-node',
    'Node-red': 'simple-icons:nodered',
    
    // 資料庫
    'MariaDB': 'devicon:mariadb',
    'MongoDB': 'skill-icons:mongodb',
    'Redis': 'devicon:redis',
    
    // 容器與部署
    'Docker': 'material-icon-theme:docker',
    'Docker Compose': 'material-icon-theme:docker',
    'Kubernetes (k8s)': 'logos:kubernetes',
    'Rancher': 'devicon:rancher',
    'Nginx': 'logos:nginx',
    'GitHub Actions': 'logos:github-actions',
    
    // 虛擬化技術
    'Proxmox':'cbi:proxmox',
    'VMware':'carbon:logo-vmware',

    // IoT與通訊
    'HTTP': 'material-symbols:http',
    'MQTT': 'cbi:mqtt',
    'EMQ X': 'emqx:tech-icon',
    'WebSocket': 'logos:websocket',
    'gRPC': 'logos:grpc',
    'RESTful API': 'mdi:api',
    
    // 雲端服務
    'AWS': 'skill-icons:aws-light',
    'GCP': 'logos:google-cloud',
    'Azure': 'logos:microsoft-azure',
    'Heroku': 'logos:heroku-icon',
    'Cloudflare': 'skill-icons:cloudflare-light',
    
    // 監控與分析
    'Grafana': 'logos:grafana',
    'GreenBone': 'material-symbols:security',
    
    // 開發/測試工具
    'Git': 'logos:git-icon',
    'GitHub': 'mdi:github',
    'VS Code': 'logos:visual-studio-code',
    'Postman': 'logos:postman-icon',
    'Zap': 'simple-icons:zap',
    'JMeter': 'simple-icons:apachejmeter',
    
    // 手機應用程式
    'Flutter': 'vscode-icons:file-type-flutter',
    'Xcode': 'logos:xcode',
    
    // 補充常用
    'SMS': 'material-symbols:sms-outline',
    'Email': 'ic:outline-email',
    'Lambert': 'lambert:tech-icon'
  };
  return techIcons[tech] || 'mdi:help-circle-outline';
};
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
  /* border: 2px solid var(--primary-color); */
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

/* Technology Icons Section */
.tech-icons-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  background-color: rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tech-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.tech-name {
  font-size: 0.9rem;
  font-weight: 500;
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
  
  .tech-icons-container {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 1rem;
  }
  
  .tech-icon {
    font-size: 2rem;
  }
  
  .tech-name {
    font-size: 0.8rem;
  }
}
</style>