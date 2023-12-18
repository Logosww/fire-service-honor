<template>
  <h3 style="margin: 0; margin-bottom: 8px;">典型展示管理</h3>
  <el-tabs v-model="activeTab">
    <el-tab-pane name="typicalCharactorDisplay" label="典型人物" lazy>
      <el-transfer
        v-model="selectedMemberData"
        :data="memberData"
        :titles="['支队典型人物', '首页展示']"
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
    </el-tab-pane>
    <el-tab-pane name="typicalDepartmentDisplay" label="典型集体" lazy>
      <el-transfer
        v-model="selectedDepartmentData"
        :data="departmentData"
        :titles="['支队典型集体', '首页展示']"
        :props="{
          key: 'id',
          label: 'departmentName'
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
    </el-tab-pane>
  </el-tabs>
  <ClientOnly>
    <el-dialog title="典型展示排序" width="1680px" v-model="dialogVisible" @open="handleDialogOpen" align-center center>
      <el-scrollbar max-height="75vh">
        <div ref="containerRef" style="display: grid; grid-template-columns: repeat(3, 1fr); grid-gap: 20px; justify-items: center;">
          <div v-for="item in details" :key="item.id">
            <CharactorCard style="cursor: move;" :detail="(item as AwardedMemberDisplayDetail)" v-if="isCharactor" />
            <DepartmentCard style="cursor: move;" :detail="(item as AwardedDepartmentDisplayDetail)" v-else />
          </div>
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

import type { AwardedMemberDisplayDetail } from '@/composables/use-api-types';

let sortableInstanceCache: ReturnType<typeof useSortable>;

const activeTab = ref('typicalCharactorDisplay');
const dialogVisible = ref(false);
const containerRef = ref();
const details = ref<((AwardedMemberDisplayDetail | AwardedDepartmentDisplayDetail) & { id: number })[]>([]);

const isCharactor = computed(() => activeTab.value === 'typicalCharactorDisplay');

const { data: memberData } = await useGetAwardedMembers();
const { data: selectedMembers } = await useGetSelectedAwardedMembers(); 
const selectedMemberData = ref(selectedMembers.value.map(({ id }) => id));
const { data: departmentData } = await useGetAwardedDepartments();
const { data: selectedDepartments } = await useGetSelectedAwardedDepartments(); 
const selectedDepartmentData = ref(selectedDepartments.value.map(({ id }) => id));

const handleChange = async (data: (number | string)[]) => {
  isCharactor.value
    ? (await useSortAwardedMemberDisplay(data as number[]))
    : (await useSortAwardedDepartmentDisplay(data as number[]))
};

const handleDialogOpen = async () => {
  const { data } = isCharactor.value
    ? (await useGetLevel1AwardedMembersDiplay())
    : (await useGetLevel1AwardedDepartmentsDiplay());
  
  details.value = data.value.map((item) => ({ 
    ...item,
    id: isCharactor.value ? (item as AwardedMemberDisplayDetail).employeeId : (item as AwardedDepartmentDisplayDetail).departmentId,
  }));
  sortableInstanceCache?.stop();
  sortableInstanceCache = useSortable(containerRef, details, { animation: 150 });
};

const handleConfirm = async () => {
  const ids = details.value.map(({ id }) => id);
  const sortFetchComposable = isCharactor.value ? useSortAwardedMemberDisplay : useSortAwardedDepartmentDisplay;
  const selectedData = isCharactor.value ? selectedMemberData : selectedDepartmentData;
  await sortFetchComposable(ids);
  selectedData.value = ids;
  dialogVisible.value = false;
  ElMessage({ type: 'success', message: '编辑成功' });
};

</script>