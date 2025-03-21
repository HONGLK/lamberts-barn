<template>
  <div class="project-card" @click="toggleDetails">
    <div class="project-image-container">
      <img :src="project.img" :alt="project.title" class="project-image">
      <span v-if="project.year" class="image-year">{{ project.year }}</span>
    </div>
    <div class="project-title">
      <h3>{{ project.title }}</h3>
    </div>
    <div class="project-info">
      <p class="description">{{ project.description || $t('components.projectCard.noDescription') }}</p>
    </div>
    <div class="tech-icons">
      <Icon
        v-for="tech in project.technologies"
        :key="tech"
        :icon="getTechIcon(tech)"
        :title="tech"
        :class="['tech-icon', tech.toLowerCase()]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import { Icon, addIcon } from '@iconify/vue';
import { useI18n } from '#imports';

const { t } = useI18n();
const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

// console.log('ProjectCard received project:', props.project);
const showDetails = ref(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

addIcon('lambert:tech-icon', {
  body: `<svg width="24" height="33" viewBox="0 0 24 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.0980787 27.0095C-0.407069 29.3471 1.08887 31.6539 3.43936 32.1618C3.47754 32.1701 3.5157 32.1778 3.55385 32.185C3.75763 32.2478 3.96905 32.2808 4.18583 32.2808H20.6102C22.2732 32.2808 23.6213 30.3357 23.6213 27.9363C23.6213 25.5369 22.2732 23.5918 20.6102 23.5918H9.74598L13.599 5.76187C14.1041 3.42426 12.6082 1.11749 10.2577 0.609562C7.90719 0.101631 5.59223 1.58488 5.08709 3.92249L0.0980787 27.0095ZM7.31616 23.5918L11.2775 5.26022C11.5072 4.19767 10.8272 3.14914 9.75877 2.91826C8.69037 2.68738 7.63812 3.36159 7.40851 4.42414L3.21678 23.8217C3.52087 23.6726 3.8468 23.5918 4.18583 23.5918H4.48136L8.56922 4.67496C8.66106 4.24994 9.08196 3.98026 9.50932 4.07261C9.93668 4.16496 10.2087 4.58437 10.1168 5.00939L6.10125 23.5918H7.31616ZM5.58916 25.9615H6.80407L6.54802 27.1464H5.33311L5.58916 25.9615ZM3.96368 25.9874C3.31342 26.1405 2.81713 26.9548 2.81713 27.9363C2.81713 28.7886 3.1913 29.5147 3.71556 29.7914C3.78769 29.816 3.86199 29.8366 3.93826 29.8531C4.87321 30.0551 5.79578 29.5641 6.16555 28.7262H4.18582C4.0286 28.7262 3.88687 28.6306 3.78702 28.4775C3.60866 28.2946 3.52242 28.0294 3.58021 27.762L3.96368 25.9874ZM8.23041 29.9111C8.39925 29.5826 8.52826 29.2269 8.60995 28.8489L8.63645 28.7262H20.6102C20.9126 28.7262 21.1577 28.3726 21.1577 27.9363C21.1577 27.5001 20.9126 27.1464 20.6102 27.1464H8.97785L9.23389 25.9615H20.6102C21.3661 25.9615 21.9789 26.8457 21.9789 27.9363C21.9789 29.027 21.3661 29.9111 20.6102 29.9111H8.23041Z" fill="url(#paint0_linear_107_111)"/>
<defs>
<linearGradient id="paint0_linear_107_111" x1="0.0885412" y1="0.421169" x2="23.5344" y2="32.3447" gradientUnits="userSpaceOnUse">
<stop offset="0.244792" stop-color="#3C44FA"/>
<stop offset="0.854167" stop-color="#F05600"/>
</linearGradient>
</defs>
</svg>
`,
  width: 24,
  height: 33
});

addIcon('emqx:tech-icon', {
  body: `<svg width="28" height="11" viewBox="0 0 28 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.56641 7.69336V9H1.86328V7.69336H5.56641ZM2.31445 0.46875V9H0.744141V0.46875H2.31445ZM5.06836 3.97266V5.24414H1.86328V3.97266H5.06836ZM5.54297 0.46875V1.78125H1.86328V0.46875H5.54297ZM7.19531 0.46875H8.5957L10.4531 6.5625L12.293 0.46875H13.5645L11.0332 9H9.86133L7.19531 0.46875ZM6.65039 0.46875H7.96875L8.17383 6V9H6.65039V0.46875ZM12.9199 0.46875H14.2441V9H12.7207V6L12.9199 0.46875ZM19.6699 7.76953L21.6738 9.58594L20.6777 10.5059L18.7148 8.70117L19.6699 7.76953ZM21.6211 4.05469V5.41406C21.6211 6.02734 21.5488 6.56641 21.4043 7.03125C21.2637 7.49219 21.0586 7.87695 20.7891 8.18555C20.5234 8.49414 20.2051 8.72656 19.834 8.88281C19.4629 9.03906 19.0527 9.11719 18.6035 9.11719C18.1504 9.11719 17.7383 9.03906 17.3672 8.88281C17 8.72656 16.6816 8.49414 16.4121 8.18555C16.1465 7.87695 15.9395 7.49219 15.791 7.03125C15.6426 6.56641 15.5684 6.02734 15.5684 5.41406V4.05469C15.5684 3.44141 15.6406 2.9043 15.7852 2.44336C15.9297 1.98242 16.1367 1.59766 16.4062 1.28906C16.6758 0.976563 16.9941 0.742188 17.3613 0.585938C17.7324 0.429687 18.1426 0.351562 18.5918 0.351562C19.0449 0.351562 19.457 0.429687 19.8281 0.585938C20.1992 0.742188 20.5195 0.976563 20.7891 1.28906C21.0586 1.59766 21.2637 1.98242 21.4043 2.44336C21.5488 2.9043 21.6211 3.44141 21.6211 4.05469ZM20.0566 5.41406V4.04297C20.0566 3.625 20.0254 3.26562 19.9629 2.96484C19.9004 2.66406 19.8066 2.41992 19.6816 2.23242C19.5566 2.04102 19.4023 1.90039 19.2188 1.81055C19.0391 1.7207 18.8301 1.67578 18.5918 1.67578C18.3574 1.67578 18.1484 1.7207 17.9648 1.81055C17.7852 1.90039 17.6328 2.04102 17.5078 2.23242C17.3867 2.41992 17.293 2.66406 17.2266 2.96484C17.1641 3.26562 17.1328 3.625 17.1328 4.04297V5.41406C17.1328 5.83594 17.1641 6.19727 17.2266 6.49805C17.293 6.79883 17.3887 7.04688 17.5137 7.24219C17.6387 7.43359 17.791 7.57422 17.9707 7.66406C18.1543 7.75391 18.3652 7.79883 18.6035 7.79883C18.8379 7.79883 19.0449 7.75391 19.2246 7.66406C19.4082 7.57422 19.5625 7.43359 19.6875 7.24219C19.8125 7.04688 19.9043 6.79883 19.9629 6.49805C20.0254 6.19727 20.0566 5.83594 20.0566 5.41406ZM24.1465 2.66016L24.9961 4.42969L25.7637 2.66016H27.3809L25.7344 5.76562L27.4395 9H25.8164L24.9375 7.16602L24.0938 9H22.459L24.1113 5.7832L22.5176 2.66016H24.1465Z" fill="white"/>
</svg>
`,
  width: 28,
  height: 11
});

const getTechIcon = (tech) => {
  const techIcons = {
    'JavaScript': 'vscode-icons:file-type-js',
    'Python': 'material-icon-theme:python',
    'Nuxt': 'vscode-icons:file-type-nuxt',
    'Vue.js': 'skill-icons:vuejs-light',
    'FastAPI': 'devicon:fastapi',
    'Figma': 'material-icon-theme:figma',
    'Flutter': 'vscode-icons:file-type-flutter',
    'Django': 'material-icon-theme:django',
    'Docker': 'material-icon-theme:docker',
    'Bun': 'devicon:bun',
    'Flask': 'simple-icons:flask',
    'Emqx': 'emqx:tech-icon',
    'MQTT': 'cbi:mqtt',
    'Golang': 'devicon:go-wordmark',
    'SMS': 'material-symbols:sms-outline',
    'Line': 'mage:line',
    'Email': 'ic:outline-email',
    "Gmail": 'logos:google-gmail',
    'Lambert': 'lambert:tech-icon'
  };
  return techIcons[tech] || 'mdi:help-circle-outline';
};
</script>
<style scoped>
.project-card {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3/4.2;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 auto;
  padding: 4px;
  margin-right: clamp(10px, 2vw, 20px); /* 浮動邊距 */
}

.project-card:last-child {
  margin-right: 0;
}

.project-card:hover {
  box-shadow: 0 4px 8px rgba(255,255,255,0.7);
}

.project-image-container {
  position: relative;
  height: 40%;
  min-height: 100px;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  margin: auto;
}

.image-year {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0,0,0,0.6);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: clamp(10px, 1vw, 12px); /* 自動調整字體大小 */
}

h3 {
  letter-spacing: 2px;
  margin: 10px;
  font-size: clamp(14px, 1.5vw, 18px);
}

.project-info {
  height: 30%;
  overflow-y: auto;
  min-height: 80px;
}

.description {
  margin: 0 10px;
  font-size: clamp(12px, 1vw, 14px);
  white-space: break-spaces;
}

.tech-icons {
  height: 10%;
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  min-height: 40px;
}

.project-details {
  padding: 10px;
  background-color: #f9f9f9;
}

.tech-icon {
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  margin: 5px;
}

.tech-icon.line {
  color: #00c641;
}

@media (max-width: 480px) {
  .project-card {
    max-width: 85vw;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .project-card {
    max-width: 250px;
  }
  .tech-icons {
    margin: 4px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .project-card {
    max-width: 280px;
  }
}

@media (min-width: 1025px) {
  .project-card {
    max-width: 300px;
  }
}
</style>