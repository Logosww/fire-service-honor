<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnsProps"
    :query-form="queryForm"
  >
    <template #query>
      <el-form inline>
        <el-form-item label="姓名">
          <AutoComplete v-model="queryForm.employeeName" query-target="EmployeeName" />
        </el-form-item>
        <el-form-item label="集体">
          <Select v-model="queryForm.employeeDepartment" select-target="DepartmentTree" is-tree />
        </el-form-item>
        <el-form-item>
          <el-button :icon="ElIconSearch" type="primary" @click="manageRef?.queryData(queryForm)">查询</el-button>
          <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(queryForm)">重置</el-button>
          <el-button type="primary" :icon="ElIconPlus" @click="(dialogVisible = true) && (memberId = 0)" text round>添加成员</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableOperationColumn>
      <el-table-column width="330" label="操作" align="center">
        <template #default="scope">
          <el-button :icon="ElIconDelete" type="danger" @click="handleDelete(scope)">删除</el-button>
          <el-button :icon="ElIconEdit" type="primary" @click="handleModify(scope)">编辑</el-button>
          <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>查看详情</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
  <MemberDialog :member-id="memberId" v-model="dialogVisible" @submit="handleSubmit" />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';

import type { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const tableColumnsProps = tableColumnPropsMap['/member'];

const dialogVisible = ref(false);
const memberId = ref(0);
const manageRef = ref<InstanceType<typeof Manage>>();

const queryForm = reactive({
  employeeName: '',
  employeeDepartment: ''
});

const handleDelete = (scope: ElTableRowScope) => {
  const { row } = scope;
  ConfirmDelete('成员', async () => {
    const { id: employeeId } = row;
    await useDeleteMember({ employeeId });
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '删除成功' });
  });
};

const handleModify = (scope: ElTableRowScope) => {
  const { row } = scope;
  memberId.value = row.id;
  dialogVisible.value = true;
};

const handleView = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await navigateTo(`/memberDetail?id=${id}`);
};

const handleSubmit = async (form: Record<string, any>) => {
  const isAdd = !memberId.value;
  if(isAdd) await useAddMember(filterFormNull(form));
  else await useModifyMember({ id: memberId.value, ...filterFormNull(form) });
  manageRef.value?.refreshData();
  ElMessage({ type: 'success', message: isAdd ? '添加成员成功' : '编辑成员成功' });
  dialogVisible.value = false;
};

</script>