<template>
  <el-timeline v-if="data.length">
    <el-timeline-item v-for="(item, index) in data" :key="index" :timestamp="item.issueDate" placement="top">
      <el-card style="margin-right: 20px;">
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: .4em 0;">{{ item.honorName }}</h1>
            <el-image
              style="width: 96px; height: 96px; border-radius: 8px;"
              :src="item.honorPhoto"
              :preview-src-list="[item.honorPhoto]"
              fit="cover"
              v-if="item.honorPhoto"
            />
          </div>
        </template>
        <el-descriptions>
          <el-descriptions-item label="级别">{{ item.honorLevel }}</el-descriptions-item>
          <el-descriptions-item label="颁发单位">{{ item.issueUnit }}</el-descriptions-item>
          <el-descriptions-item label="发文号">{{ item.issueNumber }}</el-descriptions-item>
          <el-descriptions-item label="获奖时所在部门">{{ item.honorDepartment }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ item.honorDesc }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-timeline-item>
  </el-timeline>
  <el-empty :image-size="150" v-else />
</template>

<script lang="ts" setup>

const props = defineProps<{ id: number }>();

const { id } = props;

const { data } = await useGetHonorRoute({ employeeId: id });

</script>