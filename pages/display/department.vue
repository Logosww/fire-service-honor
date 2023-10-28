<template>
  <ContentCard :title="`${name}典型人物`" content-style="padding: 50px 100px;">
    <template v-if="charactors.length" #extra>
      <span class="play-btn" @click="pptRef?.play"><el-icon><ElIconVideoPlay /></el-icon>轮播展示</span>
    </template>
    <el-carousel :interval="4000" type="card" height="460px" v-if="charactors.length">
      <el-carousel-item v-for="(item, index) in charactors" :key="index">
        <CharactorCard height="460px" :detail="item" @click="navigateTo(`/display/awardedMember?id=${item.employeeId}`, { open: { target: '_blank' } })" />
      </el-carousel-item>
    </el-carousel>
    <el-empty  v-else />
  </ContentCard>
  <ContentCard title="数据统计" style="margin-bottom: 150px;" content-class="statistics">
    <el-row :gutter="20">
        <el-col :span="8">
          <div class="counts">
            <el-statistic title="人员总数" :value="memberCount" />
            <el-statistic title="部门总数" :value="departmentSubCount" />
            <el-statistic title="荣誉总数" :value="honorCount" />
          </div>
        </el-col>
        <el-col :span="16">
          <Chart :option="lineChartOption" height="16vw" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <Chart :option="barChartOption" height="16vw" />
        </el-col>
        <el-col :span="8">
          <Chart :option="pieChartOption" height="16vw" />
        </el-col>
      </el-row>
  </ContentCard>
  <PPT ref="pptRef" :data="charactors" />
</template>

<script lang="ts" setup>
import PPT from '@/components/PPT.vue';

import type { ECOption } from '@/components/ChartContent.vue';

definePageMeta({
  layout: 'landing-page'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);
const name = route.query.name as unknown as string;

const pptRef = ref<InstanceType<typeof PPT>>();

const { data: charactors } = await useGetDepartmentAwardedMebers({ departmentId: id });

const { data: honorCount } = await useGetDepartmentHonorCount({ departmentId: id });
const { data: memberCount } = await useGetDepartmentMemberCount({ departmentId: id });
const { data: departmentSubCount } = await useGetDepartmentSubCount({ departmentId: id });

const { data: lastDecadeHonorData } = await useGetDepartmentHonorTrendData({ departmentId: id });
const { data: departmentHonorsCount } = await useGetDepartmentSubHonorData({ departmentId: id });
const { data: honorLevelsData } = await useGetDepartmentHonorLevelData({ departmentId: id });

const lineChartOption = computed<ECOption>(() => ({
  title: {
    text: '大队近十年荣誉数'
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
    text: '大队各部门荣誉数'
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
    text: '大队荣誉级别分布',
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

<style>
body {
  overflow: auto;
}
</style>