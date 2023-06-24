<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnsProps"
    :query-form="queryForm"
  >
    <template #query>
      <el-form inline>
        <el-form-item label="集体名称">
          <Select v-model="queryForm.departmentName" select-target="DepartmentTree" is-tree />
        </el-form-item>
        <el-form-item>
          <el-button :icon="ElIconSearch" type="primary" @click="manageRef?.queryData(queryForm)">查询</el-button>
          <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(queryForm)">重置</el-button>
          <el-button :icon="ElIconPlus" type="primary" @click="(dialogVisible = true) && (departmentId = 0)" text round>添加部门</el-button>
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
  <ClientOnly>
    <el-dialog
      width="540"
      :style="{ paddingRight: '50px' }"
      :title="departmentId ? '编辑集体' : '添加集体'"
      v-model="dialogVisible"
      align-center
    >
      <el-form ref="departmentFormRef" :rules="rules" :model="departmentForm" label-width="100" v-loading="isLoading">
        <el-form-item prop="departmentName" label="集体名称">
          <el-input v-model="departmentForm.departmentName" />
        </el-form-item>
        <el-form-item prop="departmentParent" label="上级部门">
          <Select v-model="departmentForm.departmentParent" select-target="DepartmentTree" is-tree />
        </el-form-item>
        <el-form-item prop="departmentLeader" label="集体负责人">
          <AutoComplete v-model="departmentForm.departmentLeader" query-target="EmployeeName" />
        </el-form-item>
        <el-form-item prop="departmentPhone" label="联系电话">
          <el-input v-model="departmentForm.departmentPhone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="departmentPhoto" label="集体照片">
          <el-upload
            accept="image/png, image/jpeg"
            :file-list="fileList"
            list-type="picture-card"
            :http-request="options => doUpload(options)"
            :before-remove="handlePhothoRemove"
            :limit="3"
          >
            <el-icon><ElIconPlus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item prop="departmentDescription" label="集体简介">
          <el-input v-model="departmentForm.departmentDescription" type="textarea" :autosize="{ minRows: 3 }" />
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
import { tableColumnPropsMap, COSBucketBaseUrl } from '@/constants';

import Manage from '@/components/Manage.vue';

import type { 
  FormInstance,
  FormRules,
  UploadFiles,
  UploadRequestOptions,
  UploadFile
} from 'element-plus';
import type { DepartmentDetail, ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const tableColumnsProps = tableColumnPropsMap['/department'];

const dialogVisible = ref(false);
const isSubmit = ref(false);
const isLoading = ref(false);
const departmentId = ref(0);

const queryForm = reactive({
  departmentName: ''
});
const departmentForm = 
  reactive<
    Omit<DepartmentDetail, 'id' | 'departmentHonorList'>
  >({
  departmentName: '',
  departmentDescription: '',
  departmentLeader: '',
  departmentPhone: '',
  departmentParent: '',
  departmentPhoto: []
});

const departmentFormRef = ref<FormInstance>();
const manageRef = ref<InstanceType<typeof Manage>>();

const rules: FormRules = {
  departmentName: {
    required: true,
    message: '请输入集体名称',
    trigger: 'blur'
  },
  departmentLeader: {
    required: true,
    message: '请输入集体负责人',
    trigger: 'blur'
  },
  departmentPhone: {
    required: true,
    message: '请输入联系电话',
    trigger: 'blur'
  },
  departmentParent: {
    required: true,
    message: '请选择上级部门',
    trigger: 'blur'
  }
};

const fileList = ref<UploadFiles>([]);

const { upload } = await useCOSUpload();

const doUpload = async (
  options: UploadRequestOptions
) => {
  const { file } = options;
  const key = await upload(file);
  const url = `${COSBucketBaseUrl}/${key}`;
  departmentForm.departmentPhoto.push(url);
  ElMessage({ type: 'success', message: '上传成功' });
};

const handlePhothoRemove = (file: UploadFile, files: UploadFiles) => {
  const { uid } = file;
  const index = files.findIndex(file => file.uid === uid);
  if(index < 0) return false;
  departmentForm.departmentPhoto.splice(index, 1);
  return true;
};

const handleConfirm = () => {
  departmentFormRef.value?.validate(async valid => {
    if(!valid) return;
    
    isSubmit.value = true;
    const isAdd = !departmentId.value;
    if(isAdd) await useAddDepartment(filterFormNull(departmentForm));
    else await useModifyDepartment({ id: departmentId.value, ...filterFormNull(departmentForm) });
    ElMessage({ type: 'success', message: isAdd? '添加集体成功' : '编辑集体成功' });
    manageRef.value?.refreshData();
    dialogVisible.value = false;
  })
};

const handleModify = (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  departmentId.value = id;
  dialogVisible.value = true;
};

const handleDelete = (scope: ElTableRowScope) => {
  const { row: { id: departmentId } } = scope;
  ConfirmDelete('集体', async () => {
    await useDeleteDepartment({ departmentId });
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '删除成功' });
  });
};

const handleView = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await navigateTo(`/departmentDetail?id=${id}`);
};

watch(
  () => dialogVisible.value,
  async val => {
    if(val) {
      isSubmit.value = false;
      if(!departmentId.value) return;
      isLoading.value = true;

      const { data } = 
        await useGetDepartmentDetail({ departmentId: departmentId.value });
      setFormValue(departmentForm, data);
      isLoading.value = false;
    } else {
      restoreForm(departmentForm, departmentFormRef);
      fileList.value = [];
      departmentId.value = 0;
    }
  }
)

</script>