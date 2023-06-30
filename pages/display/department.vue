<template>
  <ContentCard :title="`${name}典型人物`" style="margin-bottom: 1000px;" content-style="padding: 50px 100px;">
    <template v-if="charactors.length" #extra>
      <span class="play-btn" @click="pptRef?.play"><el-icon><ElIconVideoPlay /></el-icon>轮播展示</span>
    </template>
    <el-carousel :interval="4000" type="card" height="400px" v-if="charactors.length">
      <el-carousel-item v-for="(item, index) in charactors" :key="index">
        <CharactorCard height="400px" :detail="item" @click="navigateTo(`/display/awardedMember?id=${item.employeeId}`, { open: { target: '_blank' } })" />
      </el-carousel-item>
    </el-carousel>
    <el-empty  v-else />
  </ContentCard>
  <PPT ref="pptRef" :data="charactors" />
</template>

<script lang="ts" setup>
import PPT from '@/components/PPT.vue';

definePageMeta({
  layout: 'index'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);
const name = route.query.name as unknown as string;

const pptRef = ref<InstanceType<typeof PPT>>();

const { data: charactors } = await useGetDepartmentAwardedMebers({ departmentId: id });
</script>