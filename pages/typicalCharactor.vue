<template>
  <el-form style="margin-top: 20px;" inline>
    <el-form-item label="姓名"><AutoComplete v-model="queryForm.employeeName" query-target="EmployeeName" /></el-form-item>
    <el-form-item label="部门"><Select v-model="queryForm.departmentName" select-target="DepartmentTree" is-tree /></el-form-item>
    <el-form-item label="排序维度"><Select v-model="queryForm.regular" select-target="#" :options="['劳', '绩', '基', '纪', '能', '政']" /></el-form-item>
    <el-form-item><el-switch style="--el-switch-off-color: #8395a7;" v-model="queryForm.order" inline-prompt active-text="降序" inactive-text="升序" /></el-form-item>
    <el-form-item>
      <el-button :icon="ElIconSearch" type="primary" @click="handleQuery">查询</el-button>
      <el-button :icon="ElIconRefresh" @click="handleRestore">重置</el-button>
    </el-form-item>
  </el-form>
  <el-divider />
  <div class="charactor-cards" v-loading="isLoading">
    <div v-if="charactorsShowed?.length">
      <CharactorCard width="70%" style="margin: 0 auto; margin-bottom: 20px;" v-for="(item, index) in charactorsShowed" :key="index" :detail="item"/>
    </div>
    <el-empty v-else />
  </div>
</template>

<script lang="ts" setup>

import type { AwardedMemberDetail } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const isLoading = ref(false);
const isQueryed = ref(false);

const queryForm = reactive({
  employeeName: '',
  departmentName: '',
  regular: '',
  order: true
});

const queryResult = ref<AwardedMemberDetail[]>();
const { data: charactors } = await useGetAwardedMembers();

const charactorsShowed = computed(() => isQueryed.value ? queryResult.value : charactors.value);

const handleQuery = async () => {
  const form = filterFormNull(queryForm);
  if(Object.keys(form).length <= 1) return ElMessage({ type: 'error', message: '查询条件不能为空' });

  isQueryed.value = isLoading.value = true;
  queryResult.value = await useQueryAwardedMember(filterFormNull(queryForm));
  isLoading.value = false;
};

const handleRestore = () => {
  queryResult.value = [];
  isQueryed.value = false;
  restoreForm(queryForm);
};
</script>