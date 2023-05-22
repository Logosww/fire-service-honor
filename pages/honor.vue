<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnProps"
    :query-form="queryForm"
    :multipul-select="isAdmin"
  >
    <template #query>
      <el-form inline>
        <el-form-item label="荣誉者类别">
          <Select v-model="queryForm.honorPersonType" select-target="荣誉者类别" />
        </el-form-item>
        <el-form-item label="荣誉获得者">
          <AutoComplete v-model="queryForm.honorPerson" query-target="EmployeeName" />
        </el-form-item>
        <el-form-item label="荣誉名称">
          <Select v-model="queryForm.honorName" select-target="荣誉名称类别" filterable />
        </el-form-item>
        <el-form-item label="荣誉级别">
          <Select v-model="queryForm.honorLevel" select-target="荣誉级别" />
        </el-form-item>
        <el-form-item label="起止时间">
          <ClientOnly>
            <el-date-picker
              v-model="queryForm.timeRange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :shortcuts="datePickerShortcuts"
            />
          </ClientOnly>
        </el-form-item>
        <el-form-item>
          <el-button :icon="ElIconSearch" type="primary" @click="handleQuery">查询</el-button>
          <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(queryForm)">重置</el-button>
          <el-button :icon="ElIconPlus" type="primary" @click="(dialogVisible = true) && (honorId = 0)" text round v-if="isAdmin">添加荣誉</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableOperationColumn v-if="isAdmin">
      <el-table-column label="操作" width="230" align="center">
        <template #default="scope">
          <el-button :icon="ElIconDelete" type="danger" @click="handleDelete(scope)">删除</el-button>
          <el-button :icon="ElIconEdit" type="primary" @click="handleModify(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
  <HonorDialog v-model="dialogVisible" :honor-id="honorId" @submit="handleSubmit" v-if="isAdmin" />
</template>

<script lang="ts" setup>
import { datePickerShortcuts, tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';

import type{ ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const tableColumnProps = tableColumnPropsMap['/honor'];

const isAdmin = useAdmin();

const honorId = ref(0);
const dialogVisible = ref(false);

const manageRef = ref<InstanceType<typeof Manage>>();

const queryForm = reactive({
  honorPersonType: '',
  honorPerson: '',
  honorName: '',
  honorLevel: '',
  honorType: '',
  timeRange: ''
});

const handleQuery = () => {
  const form = {
    ...queryForm,
    timeRange: '',
    startTime: queryForm.timeRange[0] ?? '',
    endTime: queryForm.timeRange[1] ?? '',
  };
  manageRef.value?.queryData(form);
};

const handleDelete = (scope: ElTableRowScope) => {
  const { row: { id: honorId } } = scope;
  ConfirmDelete('荣誉', async () => {
    await useDeleteHonor({ honorId });
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '删除成功' });
  })
};

const handleModify = (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  honorId.value = id;
  dialogVisible.value = true;
};

const handleSubmit = async (form: Record<string, any>) => {
  const isAdd = !honorId.value;
  if(isAdd) await useAddHonor(filterFormNull(form));
  else await useModifyHonor({ id: honorId.value, ...filterFormNull(form) });
  manageRef.value?.refreshData();
  ElMessage({ type: 'success', message: isAdd ? '添加荣誉成功' : '编辑荣誉成功' });
  dialogVisible.value = false;
};

</script> 