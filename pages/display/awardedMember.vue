<template>
  <ContentCard title="先进人员详情" style="margin-bottom: 150px;" content-class="basic-info">
    <div class="detail-container">
      <BasicInfo :id="id" />
      <el-tabs v-model="activeTab">
        <el-tab-pane label="岗位履历" lazy>
          <JobHistory :id="id" />
        </el-tab-pane>
        <el-tab-pane label="重大经历" lazy>
          <Experience :id="id" />
        </el-tab-pane>
        <el-tab-pane label="荣耀之路" lazy>
          <HonorRoute :id="id" />
        </el-tab-pane>
        <el-tab-pane label="能力跃升" lazy>
          <Training :id="id" />
        </el-tab-pane>
        <el-tab-pane label="典型路线" lazy>
          <Typical :id="id" />
        </el-tab-pane>
        <el-tab-pane label="个人事迹" lazy>
          <Deed :id="id" />
        </el-tab-pane>
        <el-tab-pane label="视频集锦" lazy>
          <VideoCollection :id="id" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </ContentCard>
</template>

<script lang="ts" setup>

definePageMeta({
  layout: 'landing-page'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);

const activeTab = ref('0');
</script>

<style lang="scss">
  @use '@/assets/style/detail' as *;
</style>

<style>
body {
  overflow: auto;
}
</style>