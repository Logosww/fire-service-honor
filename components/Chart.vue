<template>
  <el-card shadow="hover" class="chart-wrapper" :style="{ height }" :body-style="{ width: '100%', height: '100%' }">
    <ClientOnly>
      <ChartContent :option="option" />
    </ClientOnly>
  </el-card>
</template>

<script lang="ts" setup>
import type { ECOption } from './ChartContent.vue';

defineProps<{
  option: ECOption;
  height?: string;
}>();

</script>

<style lang="scss">
  @use '@/assets/style/components/chart' as *;
</style>