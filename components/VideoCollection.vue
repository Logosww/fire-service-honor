<template>
  <div class="basic-table-title">
    <span class="basic-table-title__bar"></span>
    <h3 class="basic-table-title__content">视频集锦</h3>
    <div class="video-btns" v-if="!isIndex && videos?.length">
      <el-button-group :disabled="uploadDisabled" v-show="!isSelecting">
        <el-button type="primary" :icon="ElIconUpload" :loading="isUploading" @click="uploadInput?.click()" text round>上传视频</el-button>
        <el-button type="warning" :icon="ElIconEdit" @click="(isSelecting = true) && (videosCopy = videos.map(() => false))" text round>编辑</el-button>
      </el-button-group>
      <el-button-group v-show="isSelecting">
        <el-button type="danger" :icon="ElIconDelete" :disabled="!selectedVideos.length" @click="handleDelete" text bg round>删除</el-button>
        <el-button type="primary" :icon="ElIconCloseBold" @click="(selectedVideos = []) && (isSelecting = false)" text bg round>取消</el-button>
      </el-button-group>
    </div>
  </div>
  <div class="video-list" v-if="videos?.length">
    <div :class="['video-item', videosCopy[index] ? 'is-selected' : '']" v-for="(item, index) in videos" :key="index" @click="handleVideoClick(index)">
      <div class="video-item__cover">
        <el-image :src="item.videoCoverUrl" fit="cover" loading="lazy" />
        <span class="video-item__duration">{{ item.videoDuration }}</span>
      </div>
      <div class="video-item__title">
        <el-checkbox v-show="isSelecting" v-model="videosCopy[index]" @click.stop />
        {{ item.videoName }}
      </div>
    </div>
  </div>
  <el-empty v-else>
    <el-button type="primary" :icon="ElIconUpload" :disabled="uploadDisabled" :loading="isUploading" @click="uploadInput?.click()" v-if="!isIndex" >
      上传视频
    </el-button>
  </el-empty>
  <input
    ref="uploadInput"
    type="file"
    accept=".mp4,.webm,.ogg" 
    @change="handleChange"
    @click.stop
    hidden
    v-if="!isIndex"
  >
  <ClientOnly v-if="videos?.length">
    <el-dialog
      class="video-dialog"
      :title="videos[currIndex].videoName"
      v-model="dialogVisible"
      @open="handleOpen"
      @closed="player?.pause();"
      draggable
    >
      <video
        class="video-js"
        id="video__original"
        preload="auto"
      >
      </video>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import videojs from 'video.js';
import { SUPPORTED_FILE_TYPE } from '@/constants';
import { ElProgress } from 'element-plus';
import { nanoid } from 'nanoid';

import 'video.js/dist/video-js.css';

type Player = ReturnType<typeof videojs>;

const props = defineProps<{ id: number }>();

const isIndex = useRoute().path.startsWith('/display');

const currIndex = ref(0);
const isSelecting = ref(false);
const dialogVisible = ref(false);
const uploadDisabled = ref(false);
const isUploading = ref(false);
const videosCopy = ref<boolean[]>([]);
const selectedVideos = ref<number[]>([]);
const uploadInput = shallowRef<HTMLInputElement>();

const { data: videos, refresh } = await useGetVideos({ employeeId: props.id });

let player: Player;
let videoIndexCache: number;

const { upload: doUpload } = await useCOSUpload(undefined, true);

const handleVideoClick = (index: number) => {
  if(isSelecting.value) {
    const { id: videoId } = videos.value[index];
    const isSelected = videosCopy.value[index];
    isSelected 
      ? selectedVideos.value.splice(selectedVideos.value.findIndex(id => id === videoId), 1)
      : selectedVideos.value.push(videoId);
    videosCopy.value[index] = !isSelected;
  } else {
    currIndex.value = index;
    dialogVisible.value = true;
  }
};

const handleOpen = () => {
  player ?? (player = videojs('video__original', { 
    fill: true, 
    controls: true, 
    responsive: true
  }));

  const { value } = currIndex;
  videoIndexCache !== value && player.src(videos.value[value].videoUrl);
};

const handleDelete = async () => {
  await useDeleteVideos(selectedVideos.value);
  selectedVideos.value = [];
  isSelecting.value = false;
  refresh();
  ElMessage({ type: 'success', message: '删除成功' });
};

const handleChange = () => {
  const { files } = uploadInput.value!;
  files?.length && upload(files[0]);
};

const upload = async (rawFile: File) => {
  isUploading.value = uploadDisabled.value = true;

  const extension = rawFile.name.split('.').slice(-1)[0];
  if(!SUPPORTED_FILE_TYPE.includes(extension)) {
    ElMessage({
      type: 'error',
      message: '不支持的文件类型'
    });
    return;
  }
  const { coverSrc } = await getVideoCover(rawFile);
  const coverUrl = await doUpload(base64ToFile(coverSrc));
  ElMessageBox.prompt(
    undefined, 
    '视频标题', 
    { inputPlaceholder: '请输入', inputValidator: val => val ? true : '视频标题不能为空' }
  ).then(async ({ value: videoName }) => {
    const progress = ref(0);
    const status = ref();
    const messageInstance = ElMessage({
      customClass: 'upload-tip',
      duration: 0,
      offset: 100,
      showClose: false,
      message: () => h(ElProgress, {
        type: 'line',
        percentage: progress.value,
        status: status.value
      })
    });

    const videoUrl = await doUpload(rawFile, `video/${nanoid()}.${extension}`, info => {
      const { percent } = info;
      progress.value = percent * 100;
    });
    await useAddVideo({
      videoUrl,
      videoName,
      employeeId: props.id,
      videoCoverUrl: coverUrl
    });

    status.value = 'success';
    uploadDisabled.value = isUploading.value = false;
    uploadInput.value!.value = '';
    refresh();
    messageInstance.close();
    ElMessage({ type: 'success', message: '上传成功' });
  }).catch(() => uploadDisabled.value = isUploading.value = false);
}

const getVideoCover = (file: File) => {
  return new Promise<{ 
    coverSrc: string; 
    videoUrl: string;
  }>
  ((resolve, reject) => {
    const video = document.createElement('video');
    const { captureVideoCover } = useCaptureVideo(video);
    const videoUrl = URL.createObjectURL(file);
    video.preload = 'auto';
    video.src = videoUrl;
    video.addEventListener('loadeddata', () => {
      const coverSrc = captureVideoCover();
      URL.revokeObjectURL(videoUrl);
      resolve({ coverSrc, videoUrl });
    });
    video.addEventListener('error', (e) => {
      URL.revokeObjectURL(videoUrl);
      reject(e);
    });
  });
};

onBeforeUnmount(() => {
  player?.dispose();
});

</script>

<style lang="scss">
  @use '@/assets/style/video-collection' as *;
</style>