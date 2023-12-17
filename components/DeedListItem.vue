<template>
  <el-skeleton class="deed-item" :loading="isLoading" animated>
    <template #template>
      <div class="deed-item-left">
        <el-skeleton-item variant="h1" class="deed-item__title" />
        <el-skeleton-item variant="p" class="deed-item__paragraph-row" />
        <el-skeleton-item variant="p" class="deed-item__paragraph-row" />
        <el-skeleton-item variant="p" class="deed-item__paragraph-row" />
      </div>
      <el-skeleton-item class="deed-item-right" variant="image" />
      <img :src="item.coverPathUrl" @load="handleUncover" @error="handleUncover" hidden>
    </template>
    <div class="deed-item">
      <div class="deed-item-left">
        <h2 class="deed-item__title" @click="emit('view', item.id!)">{{ item.title }}</h2>
        <el-text tag="p" class="deed-item__paragraph">{{ item.digest }}...</el-text>
      </div>
      <el-image class="deed-item-right" :src="item.coverPathUrl" fit="cover" v-if="item.coverPathUrl" />
    </div>
  </el-skeleton>
</template>

<script lang="ts" setup>

defineProps<{ item: PersonalDeed }>();
const emit = defineEmits<{ (event: 'view', id: number): void }>();

const isLoading = ref(true);

const handleUncover = () => setTimeout(() => isLoading.value = false, 450);
</script>

<style lang="scss">
@use '@/assets/style/components/deed-list-item' as *;
</style>