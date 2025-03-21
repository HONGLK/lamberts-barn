<template>
  <div class="language-switcher">
    <button
      class="lang-btn"
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="switchLanguage(locale.code)"
        :class="{ 'active': currentLocale === locale.code }"
      >
      {{ locale.name }}
    </button>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value)

const switchLanguage = (localeCode) => {
  if (localeCode === currentLocale.value) return
  const path = switchLocalePath(localeCode)
  router.push(path)
}
</script>
  
<style scoped>
.language-switcher {
    display: flex;
    gap: 0.5rem;
}

.lang-btn {
  background-color: var(--surface-color);
  color: var(--on-surface-color);
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}

.lang-btn.active {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
}
</style>