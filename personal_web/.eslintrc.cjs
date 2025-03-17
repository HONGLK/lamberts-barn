module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2023: true
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'no-undef': 'warn',
    semi: ['error', 'always'],
    'no-console': 'warn',
    camelcase: 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/default': 'off',
    eqeqeq: ['error', 'always'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    'vue/html-self-closing': ['error', {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always'
      },
      svg: 'always',
      math: 'always'
    }],
    'vue/multi-word-component-names': ['error', {
      ignores: ['main', 'index', 'report', 'settings', 'default', 'Navbar', 'Recaptcha2'] // 在這裡添加你想忽略的單詞組件名
    }]
  },
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ],
  globals: {
    defineNuxtPlugin: 'readonly',
    useNuxtApp: 'readonly',
    useRuntimeConfig: 'readonly',
    $fetch: 'readonly',
    useFetch: 'readonly',
    useAsyncData: 'readonly',
    defineNuxtRouteMiddleware: 'readonly',
    defineNuxtConfig: 'readonly',
    defineEventHandler: 'readonly',
    nitroPlugin: 'readonly',
    useNuxtData: 'readonly',
    useRoute: 'readonly',
    useRouter: 'readonly',
    useState: 'readonly',
    ref: 'readonly',
    computed: 'readonly',
    watch: 'readonly',
    onMounted: 'readonly',
    onUnmounted: 'readonly',
    navigateTo: 'readonly',
    nuxtApp: 'readonly',
    definePageMeta: 'readonly',
    useHead: 'readonly'
  }
};
