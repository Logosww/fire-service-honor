<template>
  <ClientOnly>
    <teleport to='body'>
      <div ref="containerRef" class="ppt-container" @click="exit">
        <transition name="ppt-fade-in" v-for="(item, index) in data">
          <div class="ppt-item" :key="index" v-show="currentIndex === index">
            <h1 class="ppt-name">{{ isDepartment ? (item as AwardedDepartmentDisplay).departmentName : (item as AwardedMemberDisplay).employeeName }}</h1>
            <div class="ppt-body">
              <el-image class="ppt-pic" :src="item.displayImgUrl" fit="contain" />
              <div class="ppt-introduction">{{ item.displayContent }}</div>
            </div>
          </div>
        </transition>
      </div>
    </teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>

const props = defineProps<{ data: (AwardedMemberDisplay | AwardedDepartmentDisplay)[], isDepartment?: boolean }>();

const currentIndex = ref(-1);
const containerRef = ref();

let timer: NodeJS.Timeout;

const { isFullscreen, enter, exit } = useFullscreen(containerRef);

const play = () => {
  enter();
  currentIndex.value = 0;
  timer = setInterval(() => {
    let value = unref(currentIndex);
    currentIndex.value = ++value % props.data.length;
  }, 8000);
};

defineExpose({
  play
});

watch(() => isFullscreen.value, val => {
  if(!val) {
    clearInterval(timer);
    currentIndex.value = -1;
  }
})

</script>

<style lang="scss">
  @use '@/assets/style/components/PPT.scss' as *;
</style>