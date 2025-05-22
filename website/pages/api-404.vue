<template>
  <div class="api-404-container">
    <div class="container">
      <img src="/logo.png" alt="Lambert's Barn" class="logo"/>
      <div class="error-code">404</div>
        
      <p class="description">
        {{ $t('404text')}}
      </p>

      <NuxtLink to="/" class="back-link">
        {{ $t('404link') }}
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();

useHead({
  title: '404 - Not Found | Lambert\'s Barn'
});
</script>

<style scoped>
.api-404-container {
min-height: 100vh;
display: flex;
justify-content: center;
align-items: center;
background-color: var(--background-color);
color: var(--on-background-color);
white-space: pre-wrap;
}

.container {
text-align: center;
max-width: 600px;
padding: 2rem;
}

.logo {
width: 80px;
height: auto;
margin-bottom: 2rem;
filter: drop-shadow(0 4px 8px rgba(252, 146, 85, 0.3));
}

.error-code {
font-size: 5rem;
font-weight: bold;
color: var(--primary-color);
margin-bottom: 1rem;
line-height: 1;
}

.description {
font-size: 1rem;
line-height: 1.6;
margin-bottom: 2rem;
color: var(--text-secondary);
}

.back-link {
color: var(--accent);
text-decoration: none;
padding: 0.8rem 1.5rem;
border: 2px solid var(--accent);
border-radius: 6px;
transition: all 0.3s ease;
display: inline-block;
margin-top: 1rem;
}

.back-link:hover {
background-color: var(--accent);
color: var(--primary-color);
transform: translateY(-2px);
}

@media (max-width: 768px) {
.error-code {
    font-size: 4rem;
}

.container {
    padding: 1rem;
}

}
</style>