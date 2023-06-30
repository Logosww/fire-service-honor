<template>
  <div class="search-box">
    <span>典型搜索</span>
    <div class="search-box-input">
      <el-icon><ElIconSearch /></el-icon>
      <input class="search-box-input__original" type="text" v-model="searchInput">
    </div>
  </div>
  <ContentCard title="支队先锋典型" :grid-column="3" :grid-gap="20" :content-height="1200" is-grid>
    <CharactorCard v-for="(item, index) in filterCharactors" :key="item.employeeId" :detail="item" @click="navigateTo(`/display/awardedMember?id=${item.employeeId}`, { open: { target: '_blank' } })" clickable />
    <template #extra>
      <span class="play-btn" @click="pptRef?.play()"><el-icon><ElIconVideoPlay /></el-icon>轮播展示</span>
    </template>
  </ContentCard>
  <ContentCard title="大队典型名册">
    <div class="department-list">
      <a class="department-item" v-for="(item, index) in departments" :key="index" :href="`/display/department?id=${item.departmentId}&name=${encodeURIComponent(item.departmentName)}`" target="_blank">
        <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/book.png">
        <span class="department-name">{{ item.departmentName }}</span>
      </a>
    </div>
  </ContentCard>
  <ContentCard title="数据统计" content-class="statistics" content-style="padding: 0;">
    <el-row class="statistics-inner">
      <el-col class="counts" :span="4">
        <el-statistic title="人员总数" :value="memberCount" />
        <el-statistic title="单位总数" :value="departmentCount" />
        <el-statistic title="荣誉总数" :value="honorCount" />
        <el-statistic title="系统登录次数" :value="loginCount" />
      </el-col>
      <el-col :span="20">
        <Chart :option="lineChartOption" />
        <el-row :gutter="30">
          <el-col :span="16">
            <Chart :option="barChartOption" />
          </el-col>
          <el-col :span="8">
            <Chart :option="pieChartOption" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </ContentCard>
  <PPT ref="pptRef" :data="charactors" />
</template>

<script lang="ts" setup>

import PPT from '@/components/PPT.vue';
import { AwardedMemberDisplayDetail } from 'composables/use-api-types';

definePageMeta({
  layout: 'index'
});

const searchInput = ref('');
const pptRef = ref<InstanceType<typeof PPT>>();

const { data: charactors } = await useGetLevel1AwardedMembersDiplay();
const { data: departments } = await useGetDepartmentsDisplay();

const { data: honorCount } = await useGetHonorCount();
const { data: memberCount } = await useGetMemberCount();
const { data: departmentCount } = await useGetDepartmentCount();
const { data: loginCount } = await useGetLoginCount();

const { data: lastDecadeHonorData } = await useGetLastDecadeHonorData();
const { data: departmentHonorsCount } = await useGetDeparmentHonorsCount();
const { data: honorLevelsData } = await useGetHonorLevelsData();

const filterCharactors = computed(() =>
  charactors.value.filter(
    item =>
      !searchInput.value ||
      item.employeeName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
);

const lineChartOption = {
  title: {
    text: '近十年荣誉数'
  },
  xAxis: {
    type: 'category',
    data: Object.keys(lastDecadeHonorData.value)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '荣誉数',
      data: Object.values(lastDecadeHonorData.value),
      type: 'line'
    }
  ],
  tooltip: {
    trigger: 'axis',
  }
};

const barChartOption = {
  title: {
    text: '各大队荣誉数'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  yAxis: {
    type: 'value'
  },
  xAxis: {
    type: 'category',
    data: Object.keys(departmentHonorsCount.value)
  },
  series: [
    {
      name: '人数',
      type: 'bar',
      data: Object.values(departmentHonorsCount.value)
    }
  ]
};

const pieChartOption = {
  title: {
    text: '荣誉级别分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '荣誉级别',
      type: 'pie',
      radius: '50%',
      data: Object.entries(honorLevelsData.value).map(([key, value]) => ({ value: value, name: key })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};
</script>

<style lang="scss">
 @use '@/assets/style/index' as *;
</style>