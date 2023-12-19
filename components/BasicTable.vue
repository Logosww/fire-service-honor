<template>
  <div class="basic-table-title">
    <span class="basic-table-title__bar" v-if="title"></span>
    <h3 class="basic-table-title__content" v-if="title">{{ title }}</h3>
    <el-button :icon="ElIconPlus" @click="emit('append')" type="primary" round text v-if="!isIndex && data.length && !readOnly">新增</el-button>
  </div>
  <el-table class="basic-table-body" table-layout="auto" :data="data" stripe border>
    <el-table-column 
      v-for="(item, index) in tableColumnProps"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
    />
    <el-table-column label="操作" width="120" v-if="!isIndex && data.length && !readOnly && !slots.customOperations">
      <template #default="scope">
        <el-button :icon="ElIconEdit" type="primary" alt="编辑" @click="emit('modify', scope.row)" link />
        <el-button :icon="ElIconDelete" type="danger" alt="删除" @click="emit('delete', scope.row.id)" link />
      </template>
    </el-table-column>
    <el-table-column label="操作" v-if="slots.customOperations">
      <template #default="scope">
        <slot name="customOperations" :scope="scope"  />
      </template>
    </el-table-column>
    <template #empty>
      <el-empty :image-size="150">
        <el-button type="primary" :icon="ElIconPlus" @click="emit('append')" v-if="!isIndex && !readOnly">新增数据</el-button>
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
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  modify: [data: FormData];
  delete: [id: number];
  append: [void];
}>();

const slots = useSlots();

const isIndex = useRoute().path.startsWith('/display');
</script>

<style lang="scss">
  @use '@/assets/style/components/basic-table' as *;
</style>