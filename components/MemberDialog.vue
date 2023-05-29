<template>
  <ClientOnly>
    <ElDialog width="640" :title="memberId ? '编辑成员' : '添加成员'" v-model="dialogVisible" align-center>
      <el-form ref="formRef" style="padding: 0 120px 0 50px;" label-width="90" :model="form" :rules="rules" v-loading="isLoading">
        <el-form-item prop="employeeAvatar" label="证件照">
          <el-upload
            class="form-pic-uploader"
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :http-request="options => doUpload(options, handleAvatarUploaded)"
          >
            <el-icon v-if="!form.employeeAvatar"><ElIconPlus /></el-icon>
            <img :src="form.employeeAvatar" class="form-pic-uploader__pic" v-else>
          </el-upload>
        </el-form-item>
        <el-form-item prop="employeeName" label="姓名">
          <el-input v-model="form.employeeName" />
        </el-form-item>
        <el-form-item prop="employeeSex" label="性别">
          <el-select v-model="form.employeeSex">
            <el-option value="男" />
            <el-option value="女" />
          </el-select>
        </el-form-item>
        <el-form-item prop="employeeBirthdayDate" label="出生日期">
          <ClientOnly>
            <el-date-picker v-model="form.employeeBirthdayDate" value-format="YYYY-MM-DD" />
          </ClientOnly>
        </el-form-item>
        <el-form-item prop="employeeJoinDate" label="入伍时间">
          <ClientOnly>
            <el-date-picker v-model="form.employeeJoinDate" value-format="YYYY-MM-DD" />
          </ClientOnly>
        </el-form-item>
        <el-form-item prop="employeeTypeName" label="人员类别">
          <Select select-target="人员类别" v-model="form.employeeTypeName" />
        </el-form-item>
        <el-form-item prop="employeePositionRank" label="职级">
          <Select select-target="职级类别" v-model="form.employeePositionRank" />
        </el-form-item>
        <el-form-item prop="employeeTitleRank" label="头衔">
          <Select select-target="头衔类别" v-model="form.employeeTitleRank" multiple />
        </el-form-item>
        <el-form-item prop="employeeDepartment" label="集体">
          <Select select-target="DepartmentTree" v-model="form.employeeDepartment" is-tree />
        </el-form-item>
        <el-form-item prop="employeeStatus" label="在职状态">
          <Select select-target="人员状态类别" v-model="form.employeeStatus" />
        </el-form-item>
        <el-form-item prop="employeeQuitDate" label="离职时间" v-if="form.employeeStatus === '离队'">
          <ClientOnly>
            <el-date-picker v-model="form.employeeQuitDate" value-format="YYYY-MM-DD" />
          </ClientOnly>
        </el-form-item>
        <el-form-item prop="employeeLifePhoto" label="生活照">
          <el-upload 
            class="form-pic-uploader"
            accept="image/png, image/jpeg"
            :file-list="fileList"
            list-type="picture-card"
            :http-request="options => doUpload(options, handleLifePicUploaded)"
            :before-remove="handleLifePicRemove"
            :limit="3"
          >
            <el-icon><ElIconPlus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm" :loading="isSubmit">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </ElDialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { COSBucketBaseUrl } from '@/constants';

import type { 
  FormInstance, 
  FormRules,
  UploadFile,
  UploadFiles,
  UploadRequestOptions 
} from 'element-plus';

const props = defineProps<{
  modelValue: boolean;
  memberId: number;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
  (event: 'submit', form: Record<string, any>): void;
}>();

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    return val;
  }
});

const isLoading = ref(false);
const isSubmit = ref(false);
const formRef = ref<FormInstance>();

const form = reactive({
  employeeName: '',
  employeeDepartment: '',
  employeePositionRank: '',
  employeeTypeName: '',
  employeeAvatar: '',
  employeeLifePhoto: [] as string[],
  employeeSex: '',
  employeeBirthdayDate: '',
  employeeJoinDate: '',
  employeeTitleRank: []  as string[],
  employeeStatus: '',
  employeeQuitDate: ''
});

const rules: FormRules = ({
  employeeName: [{ required: true, message: '请输入姓名' }],
  employeeSex: [{ required: true, message: '请选择性别' }],
  employeeDepartment: [{ required: true, message: '请选择集体' }],
  employeeTypeName: [{ required: true, message: '请选择人员类别' }],
  employeeAvatar: [{ required: true, message: '请上传证件照' }]
});

const fileList = ref<UploadFiles>([]);

const { upload } = await useCOSUpload();

const doUpload = async (
  options: UploadRequestOptions, 
  cb: (key: string) => void
) => {
  const { file } = options;
  const key = await upload(file);
  cb?.(key);
  ElMessage({ type: 'success', message: '上传成功' });
};

const handleConfirm = () => {
  formRef.value?.validate(valid => {
    if(!valid) return;
    isSubmit.value = true;
    emit('submit', form);
  });
};

const handleAvatarUploaded = (key: string) => {
  form.employeeAvatar = `${COSBucketBaseUrl}/${key}`;
};

const handleLifePicUploaded = (key: string) => {
  const url = `${COSBucketBaseUrl}/${key}`;
  form.employeeLifePhoto.push(url);
};

const handleLifePicRemove = (file: UploadFile, files: UploadFiles) => {
  debugger
  const { uid } = file;
  const index = files.findIndex(file => file.uid === uid);
  if(index < 0) return false;
  form.employeeLifePhoto.splice(index, 1);
  return true;
};

watch(
  () => dialogVisible.value,
  async val => {
    if(val) {
      isSubmit.value = false;
      const { memberId: employeeId } = props;
      if(!employeeId) return;
      isLoading.value = true;
      const { data } = await useGetMemberProfile({ employeeId });
      setFormValue(form, data);
      if(form.employeeLifePhoto.length) {
        let uid = 0;
        form.employeeLifePhoto.forEach(url => fileList.value.push({
          uid: ++uid,
          url,
          name: '',
          status: 'success'
        }))
      }
      isLoading.value = false;
    } else {
      restoreForm(form, formRef);
      fileList.value = [];
    }
  }
)
</script>