<template>
  <div id="app">
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCN">
        <NuxtPage />
      </el-config-provider>
    </NuxtLayout>
  </div>
</template>

<script setup>
import zhCN from 'element-plus/dist/locale/zh-cn.min.mjs'
import { COSBucketBaseUrl } from '@/constants';

import 'normalize.css';

useHead({
  title: '杭州市消防救援支队',
  link: [
    {
      rel: 'icon',
      href: `${COSBucketBaseUrl}/logo@favicon.png`
    }
  ]
});
</script>
