<template>
  <div class="basic-table-title">
    <span class="basic-table-title__bar" v-if="title"></span>
    <h3 class="basic-table-title__content" v-if="title">{{ title }}</h3>
    <el-button :icon="ElIconPlus" @click="emit('append')" type="primary" round text v-if="isAdmin && data.length">新增</el-button>
  </div>
  <el-table style="margin-bottom: 20px" table-layout="auto" :data="data" stripe border>
    <el-table-column 
      v-for="(item, index) in tableColumnProps"
      :key="index"
      :prop="item.prop"
      :label="item.label"
    />
    <el-table-column label="操作" width="120" v-if="isAdmin && data.length">
      <template #default="scope">
        <el-button :icon="ElIconEdit" type="primary" alt="编辑" @click="emit('modify', scope.row)" link />
        <el-button :icon="ElIconDelete" type="danger" alt="删除" @click="emit('delete', scope.row.id)" link />
      </template>
    </el-table-column>
    <template #empty>
      <el-empty :image-size="150">
        <el-button type="primary" @click="emit('append')" v-if="isAdmin">新增数据</el-button>
      </el-empty>
    </template>
  </el-table>
</template>

<script lang="ts" setup>

import type { TableColumnProps } from '@/constants';
import type { FormData } from '@/pages/memberDetail.vue';

defineProps<{
  tableColumnProps: TableColumnProps[];
  data: Record<string, any>[];
  title: string;
}>();

const emit = defineEmits<{
  modify: [data: FormData];
  delete: [id: number];
  append: [void];
}>();

const isAdmin = useAdmin();
</script>

<style lang="scss">
  @use '@/assets/style/components/basic-table' as *;
</style>