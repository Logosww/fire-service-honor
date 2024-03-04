<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnProps"
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
        </el-form-item>
      </el-form>
    </template>

    <template #tableOperationColumn>
      <el-table-column width="150" label="操作" align="center">
        <template #default="scope">
          <el-button :icon="ElIconSwitch" type="primary" @click="handleSwitch(scope)">调动</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
  <ClientOnly>
    <el-dialog title="关系调动" width="400" v-model="dialogVisible" @closed="restoreForm(switchForm, switchFormRef)" align-center>
      <el-form ref="switchFormRef" style="padding: 0 30px;" :model="switchForm" :rules="rules">
        <el-form-item label="调动类别" prop="changeType">
          <Select v-model="switchForm.changeType" select-target="人员变动类别" />
        </el-form-item>
        <el-form-item label="转入部门" prop="changeDepartment">
          <Select v-model="switchForm.changeDepartment" select-target="DepartmentTree" :disabled="switchForm.changeDepartment === '待定'" is-tree />
          <el-checkbox v-model="switchForm.changeDepartment" true-value="待定" false-value="">待定</el-checkbox>
        </el-form-item>
        <el-form-item label="转入日期" prop="changeDate">
          <el-date-picker v-model="switchForm.changeDate" value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';

import type { FormInstance, FormRules } from 'element-plus';
import type { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: ['auth', 'admin']
});

const tableColumnProps = tableColumnPropsMap['/serviceChange'];

const dialogVisible = ref(false);

const memberId = ref(0);
const switchFormRef = ref<FormInstance>();
const manageRef = ref<InstanceType<typeof Manage>>();

const queryForm = reactive({
  employeeName: '',
  employeeDepartment: ''
});
const switchForm = reactive({
  changeType: '',
  changeDepartment: '',
  changeDate: ''
});

const rules: FormRules = {
  changeType: { required: true, trigger: 'blur', message: '请选择调动类别' },
  changeDepartment: { required: true, trigger: 'blur', message: '请选择转入部门' },
  changeDate: { required: true, trigger: 'blur', message: '请选择转入日期' }
};

const handleSwitch = (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  memberId.value = id;
  dialogVisible.value = true;
};

const handleConfirm = () => {
  switchFormRef.value?.validate(async valid => {
    if(!valid) return;

    const { value: employeeId } = memberId;
    await useSwitchService({ employeeId, ...switchForm });
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '调动成功' });
    dialogVisible.value = false;
  });
};

</script>