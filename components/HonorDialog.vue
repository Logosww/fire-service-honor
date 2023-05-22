<template>
  <ClientOnly>
    <el-dialog
      width="700"
      v-model="dialogVisible"
      :title="dialogTitle"
      align-center
    >
      <el-form
        ref="formRef"
        label-width="100"
        style="padding: 0 120px 0 40px;"
        :model="form"
        :rules="rules"
        v-loading="isLoading"
      >
        <el-form-item label="荣誉者类别" prop="honorPersonType">
          <Select :modelValue="form.honorPersonType" select-target="荣誉者类别" @update:modelValue="handlePersonTypeChange" />
        </el-form-item>
        <el-form-item label="荣誉项目" prop="honorName">
          <Select v-model="form.honorName" select-target="荣誉名称类别" filterable />
        </el-form-item>
        <el-form-item label="荣誉获得者" prop="honorPerson" v-if="form.honorPersonType">
          <Select v-model="form.honorPerson" select-target="EmployeeName" :multiple="!honorId" v-if="isHonorForPerson" />
          <Select v-model="form.honorPerson" select-target="DepartmentTree" :multiple="!honorId" is-tree v-else />
        </el-form-item>
        <!-- <el-form-item label="荣誉获得者所在部门">
          <Select v-model="form.honorPersonDepartment" select-target="DepartmentTree" is-tree />
        </el-form-item> -->
        <el-form-item label="荣誉级别" prop="honorLevel">
          <Select v-model="form.honorLevel" select-target="荣誉级别" />
        </el-form-item>
        <el-form-item label="荣誉类别" prop="honorType">
          <Select v-model="form.honorType" select-target="荣誉类别" />
        </el-form-item>
        <el-form-item label="颁发日期" prop="issueDate">
          <ClientOnly>
            <el-date-picker v-model="form.issueDate" value-format="YYYY-MM-DD" />
          </ClientOnly>
        </el-form-item>
        <el-form-item label="颁发单位" prop="issueUnit">
          <el-input v-model="form.issueUnit" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="发文号" prop="issueNumber">
          <el-input v-model="form.issueNumber" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="荣誉照片" prop="honorPhoto">
          <el-upload
            class="form-pic-uploader"
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :http-request="options => doUpload(options, handlePhotoUploaded)"
          >
            <el-icon v-if="!form.honorPhoto"><ElIconPlus /></el-icon>
            <img :src="form.honorPhoto" class="form-pic-uploader__pic" v-else>
          </el-upload>
        </el-form-item>
        <el-form-item label="荣誉简介" prop="honorDesc">
          <el-input v-model="form.honorDesc" type="textarea" :autosize="{ minRows: 3 }" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleConfirm" :loading="isSubmit">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { COSBucketBaseUrl } from '@/constants';

import type { 
  FormInstance, 
  FormRules,
  UploadRequestOptions
} from 'element-plus';
import type { HonorDetail } from '@/composables/use-api-types';

const props = defineProps<{
  modelValue: boolean;
  honorId?: number;
  isApply?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
  (event: 'submit', form: Record<string, any>): void;
}>();

const isLoading = ref(false);
const isSubmit = ref(false);

const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    return val;
  }
});

const dialogTitle = computed(() => props.isApply
  ? props.honorId ? '编辑申请' : '申请荣誉'
  : props.honorId ? '编辑荣誉' : '添加荣誉'
);
const isHonorForPerson = computed(() => 
  form.honorPersonType === '个人荣誉'
);

const formRef = ref<FormInstance>();

const form = reactive<Omit<HonorDetail, 'id'>>({
  honorDesc: '',
  honorLevel: '',
  honorName: '',
  honorPerson: [],
  honorPersonType: '',
  honorPhoto: '',
  honorType: '',
  issueDate: '',
  issueNumber: '',
  issueUnit: ''
});

const rules: FormRules = {
  honorName: { required: true, trigger: 'blur', message: '请选择荣誉项目' },
  honorLevel: { required: true, trigger: 'blur', message: '请选择荣誉级别' },
  honorPerson: { required: true, trigger: 'blur', message: '请输入荣誉获得者' },
  honorPersonType: { required: true, trigger: 'blur', message: '请选择荣誉者类别' },
  honorType: { required: true, trigger: 'blur', message: '请选择荣誉类别' },
  issueDate: { required: true, trigger: 'blur', message: '请输入颁发日期' },
  issueNumber: { required: true, trigger: 'blur', message: '请输入发文号' },
  issueUnit: { required: true, trigger: 'blur', message: '请输入颁发单位' }
};

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

const handlePhotoUploaded = (key: string) => {
  form.honorPhoto = `${COSBucketBaseUrl}/${key}`;
};

const handleConfirm = () => {
  formRef.value?.validate(valid => {
    if(!valid) return;
    isSubmit.value = true;
    emit('submit', form);
  });
};

const handlePersonTypeChange = (val: string | string[]) => {
  form.honorPersonType = val as string;
  form.honorPerson = '';
};

watch(
  () => dialogVisible.value,
  async val => {
    if(val) {
      isSubmit.value = false;
      const { honorId: id, isApply } = props;
      if(!id) return;
      isLoading.value = true;

      const { data } = isApply
        ? (await useGetApplicationDetail({ honorApplyId: id }))
        : (await useGetHonorDetail({ honorId: id }));
      setFormValue(form, data);
      isLoading.value = false;
    } else restoreForm(form, formRef);
  }
);
</script>