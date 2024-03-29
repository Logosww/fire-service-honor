<template>
  <div style="animation: fade-in .3s;">
    <el-row style="margin-top: 20px;" :gutter="50">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="人员总数" value-style="font-size: 20px;" :value="memberCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="单位总数" :value="departmentCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="荣誉总数" :value="honorCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="系统登录次数" :value="loginCount" />
        </el-card>
      </el-col>
      </el-row>
    <Chart :option="lineChartOption" />
    <el-row :gutter="30">
      <el-col :span="16">
        <Chart :option="barChartOption" />
      </el-col>
      <el-col :span="8">
        <Chart :option="pieChartOption" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { ECOption } from '@/components/ChartContent.vue';

definePageMeta({
  middleware: 'auth'
});

const { data: honorCount } = await useGetHonorCount();
const { data: memberCount } = await useGetMemberCount();
const { data: departmentCount } = await useGetDepartmentCount();
const { data: loginCount } = await useGetLoginCount();

const { data: lastDecadeHonorData } = await useGetLastDecadeHonorData();
const { data: departmentHonorsCount } = await useGetDepartmentHonorsCount();
const { data: honorLevelsData } = await useGetHonorLevelsData();

const lineChartOption = computed<ECOption>(() => ({
  title: {
    text: '近十年荣誉数'
  },
  xAxis: {
    type: 'category',
    data: lastDecadeHonorData.value && Object.keys(lastDecadeHonorData.value)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '荣誉数',
      data: lastDecadeHonorData.value && Object.values(lastDecadeHonorData.value),
      type: 'line'
    }
  ],
  tooltip: {
    trigger: 'axis',
  }
}));

const barChartOption = computed<ECOption>(() => ({
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
    data: departmentHonorsCount.value && Object.keys(departmentHonorsCount.value)
  },
  series: [
    {
      name: '人数',
      type: 'bar',
      data: departmentHonorsCount.value && Object.values(departmentHonorsCount.value)
    }
  ]
}));

const pieChartOption = computed<ECOption>(() => ({
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
      data: honorLevelsData.value && Object.entries(honorLevelsData.value).map(([key, value]) => ({ value: value, name: key })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}));

</script>