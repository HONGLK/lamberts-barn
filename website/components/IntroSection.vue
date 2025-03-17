<template>
  <section class="fullpage-section intro">
    <div class="content">
      <div class="intro-text">
        <h1>{{ typedText }}</h1>
        <p>{{ typedDescription }}</p>
      </div>
      <FloatingTags :tags="tags" />
    </div>
    <ScrollIndicator v-if="!isLastSection"/>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FloatingTags from './FloatingTags.vue'
import ScrollIndicator from './ScrollIndicator.vue';

const { t } = useI18n();

useHead({
  title: 'Barn'
})

const props = defineProps({
  tags: {
    type: Array,
    required: true
  },
  isLastSection: {
    type: Boolean,
    default: false
  }
})

const fullText = t('welcome');
const fullDescription = t('intro_description');

const typedText = ref('')
const typedDescription = ref('')

const typeText = async (text, target, delay = 100) => {
  for (let i = 0; i <= text.length; i++) {
    target.value = text.slice(0, i)
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}

onMounted(async () => {
  await typeText(fullText, typedText, 50)
  await typeText(fullDescription, typedDescription, 30)
})
</script>

<style scoped>
.intro {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  background-image: url('~/public/logo.png');
  background-size: 10%;
  background-position: center;
  background-repeat: no-repeat;
}

.intro-text {
  flex: 1;
  text-align: left;
  white-space: pre-line;
  padding-right: 20px;
}

h1 {
  color: var(--primary-color);
  white-space: pre-line;
}
</style>