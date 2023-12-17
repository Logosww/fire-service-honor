<template>
  <div class="display-container" v-show="currIndex === 0">
    <div class="search-box">
      <span>典型搜索</span>
      <div class="search-box-input">
        <el-icon><ElIconSearch /></el-icon>
        <input class="search-box-input__original" type="text" v-model="searchInput">
      </div>
    </div>
    <ContentCard title="支队先进个人" :grid-column="3" :grid-gap="20" content-height="60vh" is-grid>
      <CharactorCard height="340px" v-for="item in filterCharactors" :key="item.employeeId" :detail="item" @click="navigateTo(`/display/awardedMember?id=${item.employeeId}`, { open: { target: '_blank' } })" clickable />
      <template #extra>
        <span class="play-btn" @click="pptRef?.play()"><el-icon><ElIconVideoPlay /></el-icon>轮播展示</span>
      </template>
    </ContentCard>
  </div>
  <div class="display-container" v-show="currIndex === 1">
    <ContentCard title="支队大队名册">
      <div class="department-list">
        <a class="department-item" v-for="(item, index) in departments" :key="index" :href="`/display/department?id=${item.departmentId}&name=${encodeURIComponent(item.departmentName)}`" target="_blank">
          <img class="department-bg" src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/book.png">
          <img class="department-cover" src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/book-cover.png">
          <span class="department-name">{{ item.departmentName }}</span>
        </a>
      </div>
    </ContentCard>
  </div>
  <div class="display-container" v-show="currIndex === 2">
    <ContentCard title="支队数据概览" content-class="statistics">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="counts">
            <el-statistic title="人员总数" :value="memberCount" />
            <el-statistic title="单位总数" :value="departmentCount" />
            <el-statistic title="荣誉总数" :value="honorCount" />
            <el-statistic title="系统登录次数" :value="loginCount" />
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
  </div>
  <div class="scroll-bar">
    <div :class="['scroll-bar__thumb', currIndex === 0 ? 'active' : '']" @click="currIndex = 0"></div>
    <div :class="['scroll-bar__thumb', currIndex === 1 ? 'active' : '']" @click="currIndex = 1"></div>
    <div :class="['scroll-bar__thumb', currIndex === 2 ? 'active' : '']" @click="currIndex = 2"></div>
  </div>
  <div class="scroll-tip" v-show="currIndex !== 2">
    <el-icon><ElIconArrowDownBold /></el-icon>
  </div>
  <PPT ref="pptRef" :data="charactors" />
</template>

<script lang="ts" setup>
import PPT from '@/components/PPT.vue';

import type { ECOption } from '@/components/ChartContent.vue';

definePageMeta({
  layout: 'landing-page'
});

const currIndex = ref(0);
const searchInput = ref('');
const pptRef = ref<InstanceType<typeof PPT>>();

const { data: charactors } = await useGetLevel1AwardedMembersDiplay();
const { data: departments } = await useGetDepartmentsDisplay();

const { data: honorCount } = await useGetHonorCount();
const { data: memberCount } = await useGetMemberCount();
const { data: departmentCount } = await useGetDepartmentCount();
const { data: loginCount } = await useGetLoginCount();

const { data: lastDecadeHonorData } = await useGetLastDecadeHonorData();

const { data: departmentHonorsCount } = await useGetDepartmentHonorsCount();
const { data: honorLevelsData } = await useGetHonorLevelsData();

const filterCharactors = computed(() =>
  charactors.value.filter(
    item =>
      !searchInput.value ||
      item.employeeName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
);

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

const handleScroll = useDebounceFn((e: WheelEvent) => {
    const { target } = e;
    if((target as HTMLElement).classList.contains('content-card-main')) return;
    if(e.deltaY > 0) {
      if(currIndex.value >= 2) return;
      currIndex.value++;
    } else {
      if(currIndex.value <= 0) return;
      currIndex.value--;
    }
  }, 50);

onMounted(() => {
  window.addEventListener('wheel', handleScroll);
})
</script>

<style lang="scss">
 @use '@/assets/style/index' as *;
</style>