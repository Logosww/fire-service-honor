<template>
  <div class="box-wrapper">
    <el-row :gutter="100">
      <el-col :span="14">
        <div class="sub-title" id="生活风采">生活风采</div>
        <el-carousel height="400px" style="border-radius: 16px;">
          <el-carousel-item v-for="(item, index) in lifePhotos" :key="index">
            <el-image :src="item" fit="cover" style="height: 100%; width: 100%;" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="10">
        <div class="sub-title right" id="系统介绍">系统介绍</div>
        <p class="introduction">本系统可以协助消防队伍记录、管理并追踪队员们的荣誉和表彰事项，包括优秀个人表彰、集体奖项、先进单位等。系统具备数据分析统计功能，能为消防队伍提供更高效、便捷、科学的管理手段。</p>
      </el-col>
    </el-row>
  </div>
  <div class="box-wrapper">
    <div class="sub-title center" id="典型人物">典型人物</div>
    <el-carousel height="404px">
      <el-carousel-item v-for="(item, index) in awardedMembers" :key="index">
        <!-- <el-image :src="item.typicalPhoto" fit="cover" :style="{ height: '100%', width: '100%', cursor: item.isTypicalDeed ? 'pointer' : undefined }" @click="handleAwardedMemberClick(item)" /> -->
        <CharactorCard :detail="item" :clickable="item.isTypicalDeed" width="75%" style="margin: 0 auto" @open="handleAwardedMemberOpen" />
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="box-wrapper">
    <el-row :gutter="100">
      <el-col :span="12">
        <div class="sub-title" id="典型荣誉">典型荣誉</div>
        <!-- <ul>
          <li v-for="(item, index) in typicalHonors" :key="index" style="white-space: nowrap;">
            <span style="margin-right: 20px; font-weight: 700;">{{ item.honorName }}</span>
            <span style="margin-right: 20px; color: #666;">获得者：{{ item.honorPerson }}</span>
            <span style="margin-right: 20px; color: #666;">级别：{{ item.honorLevel }}</span>
            <span style="color: #666;">日期：{{ item.issueDate }}</span>
          </li>
        </ul> -->
        <el-table table-layout="auto" :data="typicalHonors">
          <el-table-column prop="honorName" label="荣誉名称" align="center" />
          <el-table-column prop="honorPerson" label="获得者" align="center" />
          <el-table-column prop="honorLevel" label="级别" align="center" />
          <el-table-column prop="issueDate" label="日期" align="center" />
        </el-table>
      </el-col>
      <el-col :span="12">
        <div class="sub-title right">大队风采<a href="#大队风采"></a></div>
        <div class="department-pics">
          <!-- <el-image v-for="(item, index) in departmentPhotos" :key="index" :src="item.departmentPhoto" /> -->
          <div v-for="(item, index) in departmentPhotos" :key="index">{{ item.departmentName }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="box-wrapper">
    <div class="sub-title center" id="统计数据">统计数据</div>
    <el-row :gutter="50">
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
  <ClientOnly>
    <el-dialog v-model="dialogVisible" width="60%" class="awarded-member-modal" center align-center>
      <template #header>
        <h1>{{ employeeName }}</h1>
      </template>
      <div v-loading="isLoading">
        <div v-html="content"></div>
      </div>
      <template #footer>
        <el-button type="warning" :icon="ElIconView" @click="navigateTo(`/memberDetail?id=${employeeId}`)" link>查看详情</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { navsKey } from '@/tokens';

import type { AwardedMemberDetail } from '@/composables/use-api-types';

definePageMeta({
  layout: 'index'
});

const navs = inject(navsKey)!;
navs.value = [
  '生活风采',
  '系统介绍',
  '典型人物',
  '典型荣誉',
  '大队风采',
  '统计数据',
];

const dialogVisible = ref(false);
const isLoading = ref(false);
const employeeId = ref(0);
const employeeName = ref('');
const content = ref('');

const { data: lifePhotos } = await useGetLifePhotos();
const { data: awardedMembers } = await useGetAwardedMembersAll();
const { data: typicalHonors } = await useGetTypicalHonors();
const { data: departmentPhotos } = await useGetDepartmentPhotos();

const { data: honorCount } = await useGetHonorCount();
const { data: memberCount } = await useGetMemberCount();
const { data: departmentCount } = await useGetDepartmentCount();
const { data: loginCount } = await useGetLoginCount();

const { data: lastDecadeHonorData } = await useGetLastDecadeHonorData();
const { data: departmentHonorsCount } = await useGetDeparmentHonorsCount();
const { data: honorLevelsData } = await useGetHonorLevelsData();

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

const handleAwardedMemberOpen = async (member: AwardedMemberDetail) => {
  const { employeeId: id, employeeName: name } = member;
  employeeId.value = id, employeeName.value = name;
  isLoading.value = dialogVisible.value = true;
  content.value = (await useGetPersonalDeed({ employeeId: id })).data.value;
  isLoading.value = false;
};
</script>