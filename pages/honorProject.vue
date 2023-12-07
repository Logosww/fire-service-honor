<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnProps"
  >
    <template #query>
      <el-form inline>
        <el-form-item label="荣誉名称">
          <Select v-model="queryForm.honorName" select-target="荣誉名称类别" filterable />
        </el-form-item>
        <el-form-item label="荣誉类别">
          <Select v-model="queryForm.honorType" select-target="荣誉类别" />
        </el-form-item>
        <el-form-item label="荣誉级别">
          <Select v-model="queryForm.honorLevel" select-target="荣誉级别" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="ElIconSearch" type="primary" @click="manageRef?.queryData(queryForm)">查询</el-button>
          <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(queryForm)">重置</el-button>
          <el-button :icon="ElIconPlus" type="primary" @click="(dialogVisible = true) && (honorProjectId = 0)" text round>添加荣誉项目</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #tableOperationColumn>
      <el-table-column label="操作" width="230">
        <template #default="scope">
          <el-button :icon="ElIconDelete" type="danger" @click="handleDelete(scope)">删除</el-button>
          <el-button :icon="ElIconEdit" type="primary" @click="handleModify(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
  <ClientOnly>
    <el-dialog
      width="400"
      v-model="dialogVisible"
      :title="honorProjectId ? '编辑荣誉项目' : '添加荣誉项目'"
      align-center
    >
      <el-form 
        ref="honorProjectFormRef"
        style="padding: 0 20px;"
        :model="honorProjectForm"
        :rules="rules"
      >
        <el-form-item label="荣誉项目名称" prop="honorName">
          <el-input v-model="honorProjectForm.honorName" />
        </el-form-item>
        <el-form-item label="荣誉项目类别" prop="honorType">
          <Select v-model="honorProjectForm.honorType" select-target="荣誉类别" />
        </el-form-item>
        <el-form-item label="荣誉项目级别" prop="honorLevel">
          <Select v-model="honorProjectForm.honorLevel" select-target="荣誉级别" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="isSubmit" @click="handleConfirm">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';
import type { ElTableRowScope } from '@/composables/use-api-types';
import type { FormInstance, FormRules } from 'element-plus';

definePageMeta({
  middleware: ['auth', 'admin']
});

const tableColumnProps = tableColumnPropsMap['/honorProject'];

const honorProjectId = ref(0);
const isSubmit = ref(false);
const dialogVisible = ref(false);

const honorProjectFormRef = ref<FormInstance>();
const manageRef = ref<InstanceType<typeof Manage>>();

const queryForm = reactive({
  honorName: '',
  honorType: '',
  honorLevel: ''
});
const honorProjectForm = reactive({
  honorName: '',
  honorType: '',
  honorLevel: ''
});

const rules: FormRules = {
  honorName: { required: true, trigger: 'blur', message: '请输入荣誉项目名称' },
  honorType: { required: true, trigger: 'blur', message: '请选择荣誉项目类别' },
  honorLevel: { required: true, trigger: 'blur', message: '请选择荣誉项目级别' },
};

const handleDelete = (scope: ElTableRowScope) => {
  const { row: { id: honorProjectId } } = scope;
  ConfirmDelete('荣誉项目', async () => {
    await useDeleteHonorProject({ honorProjectId });
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '删除成功' });
  });
};

const handleModify = (scope: ElTableRowScope) => {
  const { 
    row: { 
      id,
      honorName,
      honorTypeAndLevel
    }
  } = scope;
  const arr = (honorTypeAndLevel as string).split('/');
  honorProjectId.value = id;
  honorProjectForm.honorName = honorName;
  honorProjectForm.honorType = arr[0];
  honorProjectForm.honorLevel = arr[1];
  dialogVisible.value = true;
};

const handleConfirm = () => {
  honorProjectFormRef.value?.validate(async valid => {
    if(!valid) return;

    isSubmit.value = true;
    const { value: id } = honorProjectId;
    if(id) await useModifyHonorProject({ id, ...honorProjectForm });
    else await useAddHonorProject(honorProjectForm);
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: id ? '编辑荣誉项目成功' : '添加荣誉项目成功' });
    dialogVisible.value = false;
  });
};

watch(
  () => dialogVisible.value,
  val => {
    if(val) isSubmit.value = false;
    else restoreForm(honorProjectForm, honorProjectFormRef);
  }
)

</script>