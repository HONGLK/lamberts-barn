// eslint.config.mjs
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import vuePlugin from "eslint-plugin-vue";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import nuxtPlugin from "eslint-plugin-nuxt";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

export default defineConfig([
  // 基本配置
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        defineNuxtPlugin: "readonly",
        useNuxtApp: "readonly",
        useRuntimeConfig: "readonly",
        $fetch: "readonly",
        useFetch: "readonly",
        useAsyncData: "readonly",
        defineNuxtRouteMiddleware: "readonly",
        defineNuxtConfig: "readonly",
        defineEventHandler: "readonly",
        nitroPlugin: "readonly",
        useNuxtData: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        useState: "readonly",
        ref: "readonly",
        computed: "readonly",
        watch: "readonly",
        onMounted: "readonly",
        onUnmounted: "readonly",
        navigateTo: "readonly",
        nuxtApp: "readonly",
        definePageMeta: "readonly",
        useHead: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      vue: vuePlugin,
      nuxt: nuxtPlugin
    },
    rules: {
      "no-undef": "warn",
      semi: ["error", "always"],
      "no-console": "warn",
      camelcase: "off",
      "eqeqeq": ["error", "always"],
      "space-before-function-paren": ["error", {
        anonymous: "never",
        named: "never",
        asyncArrow: "always"
      }],
      "vue/html-self-closing": ["error", {
        html: {
          void: "always",
          normal: "never",
          component: "always"
        },
        svg: "always",
        math: "always"
      }],
      "vue/multi-word-component-names": ["error", {
        ignores: ["main", "index", "report", "settings", "default", "Navbar", "Recaptcha2"]
      }],
      "indent": ["error", 2], // 使用 2 空格縮排
      "vue/html-indent": ["error", 2], // Vue 模板使用 2 空格縮排
      "vue/script-indent": ["error", 2], // Vue script 部分使用 2 空格縮排
      "vue/style-indent": ["error", 2] // Vue style 使用 2 空格縮排
    }
  },
  
  // Vue 文件設定
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2023,
        sourceType: "module"
      }
    }
  },
  
  // TypeScript 文件設定
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module"
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
    }
  },
  
  // JavaScript 文件設定
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
        "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off"
    }
  }
]);