// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@element-plus/nuxt',
    '@vueuse/nuxt'
  ],
  elementPlus: {
    importStyle: 'scss',
    noStylesComponents: ['el-tree']
  },
  routeRules: {
    '/': { swr: true },
    '/admin': { swr: true },
    '/login': { prerender: true },
    '/display/**': { swr: true },
  },
  vite: {
    ssr: {
      noExternal: ['@popperjs/core', 'echarts']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/style/element-plus/index" as *;`,
        }
      }
    }
  },
  devtools: {
    enabled: false
  },
  // nitro: {
  //   devProxy: {
  //     '/api': {
  //       target: 'https://api.pams.ishortv.top',
  //       changeOrigin: true,
  //       cookieDomainRewrite: {
  //         'pams.ishortv.top': 'localhost'
  //       }
  //     } 
  //   }
  // }
});
