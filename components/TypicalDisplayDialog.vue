<template>
  <ClientOnly>
    <el-dialog width="480px" :title="`编辑典型${targetMap[target]}`" v-model="dialogVisible" @closed="restoreForm(form, formRef)" align-center>
      <el-form ref="formRef" style="padding: 0 20px;" :model="form" :rules="rules" v-loading="isLoading">
        <el-form-item prop="displayImgUrl" label="典型风采">
          <el-upload
            class="form-pic-uploader"
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :http-request="doUpload"
          >
            <el-icon v-if="!form.displayImgUrl"><ElIconPlus /></el-icon>
            <img :src="form.displayImgUrl" class="form-pic-uploader__pic" v-else>
          </el-upload>
        </el-form-item>
        <el-form-item prop="honors" label="名片荣誉">
          <Select v-model="form.honors" :options="honorOptions" clearable multiple filterable />
        </el-form-item>
        <el-form-item prop="displayContent" :label="`${targetMap[target]}简介`">
          <el-input type="textarea" placeholder="请输入" maxlength="350" v-model="form.displayContent" :autosize="{ minRows: 4 }" show-word-limit />
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
import { COSBucketBaseUrl } from '@/constants';

import type { FormRules, FormInstance, UploadRequestOptions } from 'element-plus';

const targetMap = {
  charactor: '人物',
  department: '集体',
};

const props = defineProps<{ modelValue: boolean; id: number, target: keyof typeof targetMap }>();
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val);
    return val;
  }
});

const isLoading = ref(false);
const formRef = ref<FormInstance>();

const form = reactive<AwardDisplay>({
  displayImgUrl: '',
  displayContent: '',
  honors: [],
});

const rules: FormRules = {
  displayImgUrl: { required: true, trigger: 'blur', message: '请上传典型风采照片' },
  honors: { required: true, trigger: 'blur', message: '请选择名片荣誉' },
  displayContent: { required: true, trigger: 'blur', message: `请填写${targetMap[props.target]}简介` }
};

const { data: honorOptions } = props.target === 'charactor' 
  ? (await useGetEmployeeHonors(computed(() => ({ employeeId: props.id }))))
  : (await useGetDepartmentHonors(computed(() => ({ departmentId: props.id }))));

const { upload } = await useCOSUpload();

const doUpload = async ( options: UploadRequestOptions) => {
  const { file } = options;
  const key = await upload(file);
  form.displayImgUrl = `${COSBucketBaseUrl}/${key}`;
  ElMessage({ type: 'success', message: '上传成功' });
};

const handleConfirm = () => {
  formRef.value?.validate(async valid => {
    if(!valid) return;

    const { id, target } = props;
    target === 'charactor'
      ? (await useModifyAwardedMemberDisplay({ employeeId: id, ...form }))
      : (await useModifyAwardedDepartmentDisplay({departmentId: id, ...form}));
    ElMessage({ type: 'success', message: '编辑成功' });
    dialogVisible.value = false;
  });
};

watch(
  () => dialogVisible.value,
  async val => {
    if(val) {
      isLoading.value = true;
      const { id, target } = props;
      const { data } = target === 'charactor'
        ? (await useGetAwardedMemberDisplay({ employeeId: id }).finally(() => isLoading.value = false))
        : (await useGetAwardedDepartmentDisplay({ departmentId: id }).finally(() => isLoading.value = false));
      setFormValue(form, data);
    }
  }
);
</script>