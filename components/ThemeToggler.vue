<template>
  <button class="switch" role="switch" @click="toggleDark()">
    <div class="switch__action">
      <div class="switch__icon">
        <el-icon :size="13">
          <DarkIcon class="dark-icon" />
          <LightIcon class="light-icon" />
        </el-icon>
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { isDarkInjectionKey } from '@/tokens';

const isDark = inject(isDarkInjectionKey)!;
const toggleDark = useToggle(isDark);
</script>

<style lang="scss">
@use '@/assets/style/components/theme-toggler' as *;
</style>