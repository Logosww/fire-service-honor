<template>
  <div>
    <el-descriptions title="基本信息" border>
      <el-descriptions-item label="名称">{{ data.departmentName }}</el-descriptions-item>
      <el-descriptions-item label="上级部门">{{ data.departmentParent }}</el-descriptions-item>
      <el-descriptions-item label="负责人">{{ data.departmentLeader }}</el-descriptions-item>
      <el-descriptions-item label="集体照片">
        <el-carousel v-if="data.departmentPhoto.length">
          <el-carousel-item v-for="(item, index) in data.departmentPhoto">
            <el-image :src="item" fit="cover" style="width: 100%; height: 100%;" :preview-src-list="data.departmentPhoto" :initial-index="index" preview-teleported />
          </el-carousel-item>
        </el-carousel>
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ data.departmentPhone }}</el-descriptions-item>
      <el-descriptions-item label="简介">{{ data.departmentDescription }}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions style="margin-top: 20px;" title="荣誉列表">
      <el-descriptions-item>
        <el-timeline v-if="data.departmentHonorList.length">
          <el-timeline-item v-for="(item, index) in data.departmentHonorList" :key="index" :timestamp="item.issueDate" placement="top">
            <el-card style="width: 70%;">
              <h2>{{ item.honorName }}</h2>
              <el-descriptions>
                <el-descriptions-item label="荣誉者类别">{{ item.honorPersonType }}</el-descriptions-item>
                <el-descriptions-item label="荣誉获得者">{{ item.honorPerson }}</el-descriptions-item>
              </el-descriptions>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty :image-size="240" v-else />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  middleware: 'auth'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);

const { data } = 
  await useGetDepartmentDetail({ departmentId: id });

</script>