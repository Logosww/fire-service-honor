<template>
  <ClientOnly>
    <el-dialog width="480px" title="编辑典型" v-model="dialogVisible" @closed="restoreForm(form, formRef)" align-center>
      <el-form ref="formRef" style="padding: 0 20px;" :model="form" :rules="formRequired ? rules : undefined">
        <el-form-item label="典型风采">
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
        <el-form-item label="人物简介">
          <el-input type="textarea" placeholder="请输入" maxlength="200" v-model="form.displayContent" :autosize="{ minRows: 4 }" show-word-limit />
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

const props = defineProps<{ modelValue: boolean; id: number, formRequired?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [boolean] }>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val);
    return val;
  }
});

const formRef = ref<FormInstance>();

const form = reactive({
  employeeName: '',
  displayImgUrl: '',
  displayContent: ''
});

const rules: FormRules = {
  pic: { required: true, trigger: 'blur', message: '请上传典型风采照片' },
  introduction: { required: true, trigger: 'blur', message: '请填写人物简介' }
};

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

    await useModifyAwardedMemberDisplay({
      employeeId: props.id,
      displayImgUrl: form.displayImgUrl,
      displayContent: form.displayContent
    });
    ElMessage({ type: 'success', message: '编辑成功' });
    dialogVisible.value = false;
  });
};

watch(
  () => dialogVisible.value,
  async val => {
    if(val) {
      const { id } = props;
      const { data } = await useGetAwardedMemberDisplay({ employeeId: id });
      setFormValue(form, data);
    }
  }
);
</script>