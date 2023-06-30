<template>
  <ContentCard title="人员详情" style="margin-bottom: 600px;" content-style="background-color: rgba(255, 255, 255, .8); min-height: 1300px;">
    <div class="member-detail-container">
      <BasicInfo :id="id" />
      <el-tabs v-model="activeTab">
        <el-tab-pane label="岗位履历">
          <JobHistory :id="id" />
        </el-tab-pane>
        <el-tab-pane label="重大经历">
          <Experience :id="id" />
        </el-tab-pane>
        <el-tab-pane label="荣耀之路">
          <HonorRoute :id="id" />
        </el-tab-pane>
        <el-tab-pane label="能力跃升">
          <Training :id="id" />
        </el-tab-pane>
        <el-tab-pane label="典型路线">
          <Typical :id="id" />
        </el-tab-pane>
        <el-tab-pane label="个人事迹">
          <PersonalDeed :id="id" />
        </el-tab-pane>
        <el-tab-pane label="视频集锦">
          <VideoCollection :id="id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </ContentCard>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'index'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);

const activeTab = ref('0');
</script>

<style lang="scss">
  @use '@/assets/style/member-detail' as *;
</style>