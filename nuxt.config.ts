// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@element-plus/nuxt',
    '@vueuse/nuxt'
  ],
  elementPlus: {
    // components: ['ElTree']
    noStylesComponents: ['el-tree']
  },
  routeRules: {
    '/login': { prerender: true }
  },
  vite: {
    ssr: {
      noExternal: ['@popperjs/core', 'echarts']
    }
  },
  devtools: {
    enabled: false
  }
})
