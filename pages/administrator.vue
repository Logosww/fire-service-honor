<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnProps"
    :query-form="queryForm"
  >
    <template #query>
      <el-form inline>
        <el-form-item label="用户名">
          <AutoComplete v-model="queryForm.username" query-target="UserName" />
        </el-form-item>
        <el-form-item label="集体">
          <Select v-model="queryForm.departmentName" select-target="DepartmentTree" is-tree />
        </el-form-item>
        <el-form-item>
          <el-button :icon="ElIconSearch" type="primary" @click="manageRef?.queryData(queryForm)">查询</el-button>
          <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(queryForm)">重置</el-button>
          <el-button :icon="ElIconPlus" type="primary" @click="dialogVisible = true" text round>添加管理员</el-button>
          <el-button :icon="ElIconDownload" type="info" text round>导出Excel</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableOperationColumn>
      <el-table-column width="250" label="操作" align="center">
        <template #default="scope">
          <el-button :icon="ElIconDelete" type="danger" @click="handleDelete(scope)">删除</el-button>
          <el-button :icon="ElIconRefresh" @click="handleResetPwd(scope)">重置密码</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
  <ClientOnly>
    <el-dialog title="添加管理员" width="380" align-center v-model="dialogVisible">
      <el-form :model="addForm" :rules="rules" label-width="80" ref="addFormRef">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addForm.username" />
        </el-form-item>
        <el-form-item prop="departmentName" label="部门">
          <Select select-target="DepartmentTree" v-model="addForm.departmentName" is-tree />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm" :loading="isAdding">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';
import Manage from '@/components/Manage.vue';

import type { FormInstance, FormRules } from 'element-plus';

definePageMeta({
  middleware: ['auth', 'admin']
});

const tableColumnProps = tableColumnPropsMap['/administrator'];

const manageRef = ref<InstanceType<typeof Manage>>();
const addFormRef = ref<FormInstance>();

const dialogVisible = ref(false);
const isAdding = ref(false);

const queryForm = reactive({
  username: '',
  departmentName: ''
});
const addForm = reactive({
  username: '',
  departmentName: ''
});

const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  departmentName: {
    required: true,
    message: '请输入部门',
    trigger: 'blur'
  }
};

const handleConfirm = () => {
  addFormRef.value?.validate(async valid => {
    if(!valid) return;
    
    isAdding.value = true;
    await useAddUser(addForm);
    dialogVisible.value = isAdding.value = false;
    ElNotification({ type: 'success', message: '添加管理员成功' });
    manageRef.value?.refreshData();
  });
};

const handleDelete = async (scope: any) => {
  const { row: { id: userId } } = scope;
  
  ConfirmDelete('管理员', async () => {
    await useDeleteUser({ userId });
    ElMessage({ type: 'success', message: '删除成功' });
    manageRef.value?.refreshData();
  });
};

const handleResetPwd = (scope: any) => {
  const { row: { id: userId } } = scope;

  ElMessageBox.confirm(
    '确认重置密码？',
    '提示',
    {
      type: 'info',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    await useResetUserPwd({ userId });
    ElMessage({ type: 'success', message: '重置成功' });
  });
};

</script>