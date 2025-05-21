export default defineNuxtConfig({
  app: {
    head: {
      title: 'Lambert\'s Barn',
      titleTemplate: 'Lambert\'s Barn | %s',
      meta: [
        { name: 'description', content: '我是藍博特 Lambert ，歡迎來到 Lambert\' Barn ，這裡記錄了我的生活點滴、工作記錄及專案。' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.png' }
      ]
    }
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css:['/assets/css/main.css'],
  plugins: ['~/plugins/fontawesome.js'],
  modules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/i18n',
    '@nuxtjs/strapi',
  ],
  i18n: {
    locales: [
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    lazy: true,
    compositionOnly: false,
    langDir: '../locales/',
    defaultLocale: 'zh-TW',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
    }
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://api.localhost',
    prefix: '/api',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt'
  },
  eslint: {
    fix: true
  }
});