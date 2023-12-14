<template>
  <div style="padding-right: 32px;" v-loading="isMceLoading">
    <el-form ref="formRef" :model="personalDeed" :rules="formRules" style="overflow: hidden; margin-bottom: 6px;">
      <el-form-item prop="title" style="float: left; width: 85%;">
        <el-input v-model="personalDeed.title" placeholder="请输入">
          <template #prepend>标题</template>
        </el-input>
      </el-form-item>
      <el-form-item style="overflow: hidden; float: right;">
        <ClientOnly>
          <el-dropdown type="primary" @click="handleAppendOrModify" @command="handleCommand" split-button>
            <el-icon style="margin-right: 8px;"><ElIconCheck/></el-icon>
              保存
            <template #dropdown>
              <el-dropdown-item command="deletePeronsalDeed" :icon="ElIconDelete">
                删除
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </ClientOnly>
      </el-form-item>
    </el-form>
    <ClientOnly>
      <Editor
        v-model="personalDeed.content"
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
  title: { required: true, message: '个人事迹标题不能为空', trigger: 'blur' }
};

const route = useRoute();
const isAppend = route.query.append === 'true';
const personalDeedId = parseInt(route.query.id as string);
const personalDeed = !isAppend && personalDeedId 
  ? (await useGetPersonalDeed({ id: personalDeedId })).data
  : ref<Omit<PersonalDeed, 'id' | 'digest'>>({
      title: '',
      content: '',
      coverPathUrl: ''
    });
const employeeId = isAppend
    ? parseInt(route.query.employeeId as string)
    : personalDeed.value.employeeId!;

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
  content_css: 'dark',
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
    
    const { content } = personalDeed.value;
    personalDeed.value.coverPathUrl = 
      content?.match(/<img.*?(?:>|\/>)/gi)?.at(0)
      ?.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)?.at(1);

    isAppend 
      ? await useAddPersonalDeed({ employeeId, ...personalDeed.value})
      : await useModifyPersonalDeed(personalDeed.value);
    ElMessage({ type: 'success', message: '保存成功' });
    await navigateTo(`/memberDetail?id=${employeeId}#个人事迹`);
  });
};

const handleCommand = (commond: string) => {
  if(commond === 'deletePeronsalDeed') {
    ConfirmDelete('个人事迹', async () => {
      await useDeletePersonalDeed({ id: personalDeedId });
      ElMessage({ type: 'success', message: '删除成功' });
      await navigateTo(`/memberDetail?id=${employeeId}#个人事迹`);
    });
  }
};
</script>