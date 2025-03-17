<template>
    <footer class="footer">
      <div class="container">
        <p>Lambert76 &copy; {{ currentYear }} All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    computed: {
      currentYear() {
        return new Date().getFullYear();
      }
    }
  }
  </script>
  
  <style scoped>
  .footer {
    /* background-color: #f8f9fa; */
    padding: 0;
    text-align: center;
  }
  
  .container {
    max-width: 100vw;
    margin: 0 auto;
    padding: 0 15px;
  }
  </style>