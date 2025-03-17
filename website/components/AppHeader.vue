<template>
  <header class="header">
    <nav class="nav">
      <img src="/logo.png" alt="Logo" class="logo">
      <div class="nav-center">
        <ul class="menu-list">
          <li>
            <NuxtLink :to="localePath('/')" class="menu-link">
              {{ $t('home') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/blog')" class="menu-link">
              {{ $t('blog') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/about')" class="menu-link">
              {{ $t('about') }}
            </NuxtLink>
          </li>
        </ul>
        <LanguageSwitcher />
      </div>
      <!-- <ul class="nav-list">
        <li>
        </li>
        <li>
          <NuxtLink to="/" class="icon-link">
            <font-awesome-icon :icon="['fas', 'home']" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="https://github.com/Honglk" target="_blank" class="icon-link">
            <font-awesome-icon :icon="['fab', 'github']" />
          </NuxtLink>
        </li>
      </ul> -->
    </nav>
  </header>
</template>

<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue';

const localePath = useLocalePath();
</script>

<style scoped>
.header {
  padding: 1rem;
  /* background-color: #f8f9fa; */
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 40px;
  margin-right: 1rem;
}

.nav-center {
  flex: 1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.menu-list {
  display: flex;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.menu-link {
  color: var(--on-surface-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.menu-link:hover {
  color: var(--primary-color);
}

.nav-list {
  display: flex;
  list-style-type: none;
  margin: 0;
  align-items: center;
  gap: 1rem;
}

/* 統一圖標樣式 */
.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--surface-color);
  color: var(--on-surface-color);
  transition: all 0.3s ease;
}

.icon-link:hover {
  background-color: var(--primary-color);
  color: var(--on-primary-color);
  transform: translateY(-2px);
}

.material-symbols-outlined {
  font-size: 20px;
}

.icon-link {
  font-size: 20px;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-center {
    order: 3;
    width: 100%;
  }
  
  .menu-list {
    width: 100%;
    justify-content: space-between;
  }
  
  .nav-list {
    order: 2;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>