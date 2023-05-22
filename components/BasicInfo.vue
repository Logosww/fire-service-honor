<template>
  <div class="basic-info-container">
    <el-descriptions :column="4" border>
      <el-descriptions-item label="姓名">{{ profile.employeeName }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ profile.employeeSex }}</el-descriptions-item>
      <el-descriptions-item label="集体">{{ profile.employeeDepartment }}</el-descriptions-item>
      <el-descriptions-item label="职级">{{ profile.employeePositionRank }}</el-descriptions-item>
      <el-descriptions-item label="出生日期">{{ profile.employeeBirthdayDate }}</el-descriptions-item>
      <el-descriptions-item label="入伍时间">{{ profile.employeeJoinDate }}</el-descriptions-item>
      <el-descriptions-item label="消防救援头衔">
        <el-tag v-for="item in profile.employeeTitleRank">{{ item }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="人员状态">{{ profile.employeeStatus }}</el-descriptions-item>
      <el-descriptions-item label="离伍时间" v-if="profile.employeeStatus === '离职'">{{ profile.employeeQuitDate }}</el-descriptions-item>
      <el-descriptions-item label="证件照">
        <el-image :src="profile.employeeAvatar" :preview-src-list="picList" style="border-radius: 4px;" fit="cover" />
      </el-descriptions-item>
      <el-descriptions-item label="典型风采">
        <el-image v-for="(item, index) in profile.employeeLifePhoto" :src="item" :preview-src-list="picList" :initial-index="index + 1" style="margin-right: 15px; border-radius: 4px;" fit="cover" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  id: number;
}>();

const { data: profile } = await useGetMemberProfile({ employeeId: props.id });

const picList = [ profile.value.employeeAvatar, ...profile.value.employeeLifePhoto];
</script>

<style lang="scss">
  @use '@/assets/style/components/basic-info.scss' as *;
</style>