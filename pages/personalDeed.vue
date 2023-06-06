<template>
  <div>
    <el-button :icon="ElIconSelect" style="margin-bottom: 10px;" type="primary" @click="handleSave">保存</el-button>
    <Editor
      v-model="content"
      api-key="qkzruwok1b2w0xv38p723m9rjdtl8lcfaj7yiegxks5wdmx2"
      :init="editInit"
    />
  </div>
</template>

<script lang="ts" setup>
import Editor from '@tinymce/tinymce-vue';

definePageMeta({
  middleware: 'auth'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);
const { data: content } = await useGetPersonalDeed({ employeeId: id });


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

const handleSave = async () => {
  await useModifyPersonalDeed({ employeeId: id, content: content.value });
  ElMessage({ type: 'success', message: '保存成功' });
  await navigateTo(`/memberDetail?id=${id}`);
};
</script>