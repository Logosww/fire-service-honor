<template>
  <NuxtLayout>
    <div id="app">
      <NuxtLoadingIndicator />
      <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCN">
        <NuxtPage />
      </el-config-provider>
    </div>
  </NuxtLayout>
</template>

<script setup>
import zhCN from 'element-plus/dist/locale/zh-cn.min.mjs';
import { COSBucketBaseUrl } from '@/constants';
import { isDarkInjectionKey } from '@/tokens';

import 'normalize.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

useHead({
  title: '杭州市消防救援支队',
  link: [
    {
      rel: 'icon',
      href: `${COSBucketBaseUrl}/logo@favicon.png`
    }
  ]
});


const isDark = useDark({ disableTransition: false });
provide(isDarkInjectionKey, isDark);
</script>
