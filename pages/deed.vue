<template>
  <div style="padding-right: 32px;" v-loading="isMceLoading">
    <el-form ref="formRef" :model="deed" :rules="formRules" style="overflow: hidden; margin-bottom: 6px; margin-top: 8px;">
      <el-form-item prop="title" style="float: left; width: 85%;">
        <el-input v-model="deed.title" placeholder="请输入">
          <template #prepend>标题</template>
        </el-input>
      </el-form-item>
      <el-form-item style="overflow: hidden; float: right;">
        <ClientOnly>
          <el-dropdown type="primary" @click="handleAppendOrModify" @command="handleCommand" split-button>
            <el-icon style="margin-right: 8px;"><ElIconCheck/></el-icon>
              保存
            <template #dropdown v-if="target">
              <el-dropdown-item command="deleteDeed" :icon="ElIconDelete">
                删除
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </ClientOnly>
      </el-form-item>
    </el-form>
    <ClientOnly>
      <Editor
        v-model="deed.content"
        api-key="qkzruwok1b2w0xv38p723m9rjdtl8lcfaj7yiegxks5wdmx2"
        :init="editInit"
        @vue:mounted="isMceLoading = false"
      />
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue';

import type { FormInstance, FormRules } from 'element-plus';

definePageMeta({
  middleware: 'auth'
});

const isMceLoading = ref(true);
const formRef = ref<FormInstance>();
const formRules: FormRules = {
  title: { required: true, message: '事迹标题不能为空', trigger: 'blur' }
};

const route = useRoute();
const deedId = parseInt(route.query.id as string);
const target = route.query.target;
const employeeId = parseInt(route.query.employeeId as string);
const departmentId = parseInt(route.query.departmentId as string);
const deed = deedId
  ? (target === 'person' ? (await useGetPersonalDeed({ id: deedId })).data : (await useGetDepartmentDeed({ id: deedId })).data)
  : ref<Omit<Deed, 'id' | 'digest'>>({
      title: '',
      content: '',
      coverPathUrl: ''
    });

let progressHandler: (percent: number) => void;

const { upload } = await useCOSUpload(progress => {
  const progressPercent = progress.percent * 100;
  progressHandler?.(progressPercent);
}, true);

const uploadImage = (
  blobInfo: {
    blob: () => Blob,
    filename: () => string
  },
  progress: (percent: number
) => void) => {
  progressHandler = progress;
  const blob = blobInfo.blob();
  const filename = blobInfo.filename();
  const extension = filename.split('.').at(-1);
  const file = new File([blob], filename, { type: `image/${extension}` });
  return upload(file);
};

const editInit = {
  language: 'zh_CN',
  plugins: ['link', 'image', 'autolink', 'preview', 'autoresize', 'autosave', 'fullscreen', 'media', 'insertdatetime', 'wordcount', 'searchreplace'],
  toolbar: [
    { name: '历史', items: [ 'undo', 'redo' ] },
    { name: '格式', items: [ 'styles' ] },
    { name: '样式', items: [ 'bold', 'italic' ] },
    { name: '对齐', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
    { name: '缩进', items: [ 'outdent', 'indent' ] },
    { name: '插入', items: [ 'link', 'image', 'media' ] },
    { name: '预览', items: [ 'preview'] },
  ],
  browser_spellcheck: true,
  image_uploadtab: true,
  images_upload_handler: uploadImage,
};

const handleAppendOrModify = () => {
  formRef.value?.validate(async isValid => {
    if(!isValid) return;
    
    const { content } = deed.value;
    deed.value.coverPathUrl = 
      content?.match(/<img.*?(?:>|\/>)/gi)?.at(0)
      ?.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)?.at(1);

    target 
      ? (employeeId ? (await useModifyPersonalDeed(deed.value)) : (await useModifyDepartmentDeed(deed.value)))
      : (employeeId ? (await useAddPersonalDeed({ employeeId, ...deed.value})) : (await useAddDepartmentDeed({ departmentId, ...deed.value})));
    ElMessage({ type: 'success', message: '保存成功' });
    history.length ? history.back() : (await navigateTo('/admin'));
  });
};

const handleCommand = (commond: string) => {
  if(commond === 'deleteDeed') {
    ConfirmDelete('事迹', async () => {
      target === 'person' ? (await useDeletePersonalDeed({ id: deedId })) : (await useDeleteDepartmentDeed({ id: deedId }));
      ElMessage({ type: 'success', message: '删除成功' });
      history.length ? history.back() : (await navigateTo('/admin'));
    });
  }
};
</script>