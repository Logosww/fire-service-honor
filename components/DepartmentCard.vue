<template>
  <el-card :class="['department-card', clickable ? 'is-clickable' : '']" :style="{ height }">
    <h1 class="department-name">{{ detail.departmentName }}</h1>
    <div class="department-info">
      <div class="department-pic">
        <el-image :src="detail.departmentPhoto" fit="cover" :preview-src-list="[detail.departmentPhoto]" preview-teleported @click.stop>
          <template #error>
            <img style="height: 100%; object-fit: cover;" src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/default-typical-department.png" />
          </template>
        </el-image>
      </div>
      <ul class="department-honors">
        <li v-for="(item, index) in detail.departmentHonors.slice(0, 3)" :key="index">
          <el-icon><ElIconTrophy /></el-icon>
          {{ item }}
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script lang="ts" setup>

const props = defineProps<{
  detail: AwardedDepartmentDisplayDetail;
  clickable?: boolean;
  height?: string;
}>();

</script>

<style lang="scss">
@use '@/assets/style/components/department-card' as *;
</style>