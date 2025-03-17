<template>
  <section class="fullpage-section skills">
    <div class="content">
      <h2>專長領域</h2>
        <ul>
          <li v-for="(skill, index) in skills" :key="index">
          <span class="material-symbols-outlined">{{ skill.icon }}</span> {{ skill.name }}
        </li>
      </ul>
    </div>
  </section>
</template>
  
<script setup>
  defineProps({
    skills: {
      type: Array,
      required: true
    }
  })
</script>
  
<style scoped>
.skills {
  background-color: var(--surface-color);
  color: var(--on-surface-color);
}
  
h2 {
  color: var(--primary-color);
}
  
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 20px 0;
  font-size: 1.2em;
}

.material-symbols-outlined {
  margin-right: 10px;
  color: var(--secondary-color);
}
</style>