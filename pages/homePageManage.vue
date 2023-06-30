<template>
  <h3>典型人物展示管理</h3>
  <el-transfer
    v-model="selectedData"
    :data="data"
    :titles="['典型人物', '已选择']"
    :props="{
      key: 'id',
      label: 'employeeName'
    }"
    filter-placeholder="输入搜索"
    @change="handleChange"
    filterable
  >
    <template #right-footer>
      <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
        <el-button type="primary" :icon="ElIconSort" @click="dialogVisible = true" text round>排序</el-button>
      </div>
    </template>
  </el-transfer>
  <ClientOnly>
    <el-dialog title="典型展示排序" width="1680px" v-model="dialogVisible" @open="handleDialogOpen" align-center center>
      <el-scrollbar max-height="75vh">
        <div ref="containerRef" style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 20px; justify-items: center;">
          <CharactorCard style="cursor: move;" v-for="item in details" :key="item.id" :detail="item" />
        </div>
      </el-scrollbar>
      <template #footer>
        <el-button type="primary" :icon="ElIconCheck" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { useSortable } from '@vueuse/integrations/useSortable';

import type { AwardedMemberDisPlayDetail } from '@/composables/use-api-types';

const dialogVisible = ref(false);
const containerRef = ref();
const details = ref<(AwardedMemberDisPlayDetail & { id: number })[]>([]);
let sortableInstanceCache: ReturnType<typeof useSortable>;

const { data } = await useGetAwardedMembers();
const { data: selectedMembers } = await useGetSelectedAwardedMembers(); 
const selectedData = ref(selectedMembers.value.map(({ id }) => id));

const handleChange = async (data: number[]) => {
  await useSortAwardedMemberDisplay(data);
}

const handleDialogOpen = async () => {
  const { data } = await useGetLevel1AwardedMembersDiplay();
  details.value = data.value.map((item) => ({ id: item.employeeId, ...item }));
  sortableInstanceCache?.stop();
  sortableInstanceCache = useSortable(containerRef, details, { animation: 150 });
};

const handleConfirm = async () => {
  const ids = details.value.map(({ id }) => id);
  await useSortAwardedMemberDisplay(ids);
  selectedData.value = ids;
  dialogVisible.value = false;
  ElMessage({ type: 'success', message: '编辑成功' });
};

</script>