<template>
  <div class="content-card">
    <div class="content-card-header">
      <span>{{ title }}</span>
      <slot name="extra" />
    </div>
    <el-scrollbar :max-height="contentHeight" v-if="contentHeight">
      <div ref="containerRef" :class="['content-card-main', isGrid ? 'is-grid': '', contentClass]" :style="styles">
        <slot />
      </div>
    </el-scrollbar>
    <div ref="containerRef" :class="['content-card-main', isGrid ? 'is-grid': '', contentClass]" :style="styles" v-else>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  title: string;
  isGrid?: boolean;
  gridColumn?: number;
  gridGap?: number;
  contentHeight?: number | string;
  contentStyle?: string;
  contentClass?: string;
}>();

const containerRef = ref();

const styles = props.isGrid
  ? `--content-card-grid-gap: ${props.gridGap}px; --content-card-grid-column: ${props.gridColumn}; ${props.contentStyle ?? ''}`
  : props.contentStyle;

</script>

<style lang="scss">
  @use '@/assets/style/components/content-card' as *;
</style>