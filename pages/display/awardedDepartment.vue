<template>
  <ContentCard title="先进集体详情" style="margin-bottom: 150px;" content-class="basic-info">
    <div class="detail-container">
      <el-descriptions title="基本信息" border>
        <el-descriptions-item label="名称">{{ profile.departmentName }}</el-descriptions-item>
        <el-descriptions-item label="上级部门">{{ profile.departmentParent }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ profile.departmentLeader }}</el-descriptions-item>
        <el-descriptions-item label="集体照片">
          <el-carousel height="300px" v-if="profile.departmentPhoto.length">
            <el-carousel-item v-for="(item, index) in profile.departmentPhoto">
              <el-image :src="item" fit="cover" style="width: 100%; height: 100%;" :preview-src-list="profile.departmentPhoto" :initial-index="index" preview-teleported />
            </el-carousel-item>
          </el-carousel>
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ profile.departmentPhone }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{ profile.departmentDescription }}</el-descriptions-item>
      </el-descriptions>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="荣誉列表" lazy>
          <el-scrollbar class="honor-list" max-height="850px" v-if="profile.departmentHonorList.length">
            <el-timeline class="honor-list-wrapper" v-if="!shouldUseVirtualList">
              <el-timeline-item v-for="(item, index) in profile.departmentHonorList" :key="index" :timestamp="item.issueDate" style="height: 180px;" placement="top" type="primary" hollow>
                <el-card style="width: 70%;">
                  <h2>{{ item.honorName }}</h2>
                  <el-descriptions>
                    <el-descriptions-item label="荣誉者类别">{{ item.honorPersonType }}</el-descriptions-item>
                    <el-descriptions-item label="荣誉获得者">{{ item.honorPerson }}</el-descriptions-item>
                  </el-descriptions>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <div class="honor-list-container" v-bind="containerProps" style="height: 850px" v-else>
              <el-timeline class="honor-list-wrapper" v-bind="wrapperProps">
                <el-timeline-item v-for="{ data, index } in virtualList" :key="index" :timestamp="data.issueDate" style="height: 180px;" placement="top">
                  <el-card style="width: 70%;">
                    <h2>{{ data.honorName }}</h2>
                    <el-descriptions>
                      <el-descriptions-item label="荣誉者类别">{{ data.honorPersonType }}</el-descriptions-item>
                      <el-descriptions-item label="荣誉获得者">{{ data.honorPerson }}</el-descriptions-item>
                    </el-descriptions>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-scrollbar>
          <el-empty :image-size="240" v-else />
        </el-tab-pane>
        <el-tab-pane label="重大经历" lazy>
          <Experience :id="id" is-department />
        </el-tab-pane>
        <el-tab-pane label="集体事迹" lazy>
          <Deed :id="id" is-department />
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

const { data: profile } = await useGetDepartmentProfile({ departmentId: id });
const shouldUseVirtualList = profile.value.departmentHonorList.length >= 100;
const { list: virtualList, containerProps, wrapperProps } = useVirtualList(ref(profile.value.departmentHonorList), { itemHeight: 200 });

</script>

<style lang="scss">
@use '@/assets/style/detail' as *;
</style>

<style>
body {
  overflow: auto;
}
</style>