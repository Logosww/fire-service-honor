<template>
  <el-row style="margin-top: 10px;" :gutter="50">
    <el-col :span="6">
      <el-card shadow="hover">
        <el-statistic title="荣誉次数" :value="honorCount" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover">
        <el-statistic title="比武竞赛次数" :value="contestCount" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover">
        <el-statistic title="立功次数" :value="contributionCount" />
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover">
        <el-statistic title="外出培训次数" :value="trainingCount" />
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="30">
    <el-col :span="8">
      <Chart :option="radarOption" />
    </el-col>
    <el-col :span="16">
      <Chart :option="lineChartOption" />
    </el-col>
  </el-row>
  <el-row :gutter="30">
    <el-col :span="16">
      <Chart :option="barChartOption" />
    </el-col>
    <el-col :span="8">
      <Chart :option="pieChartOption" />
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>

const props = defineProps<{ id: number }>();

const { id } = props;

const { data: honorCount } = await useGetMemberHonorCount({ employeeId: id });
const { data: contestCount } = await useGetMemberContestCount({ employeeId: id });
const { data: contributionCount } = await useGetMemberContributionCount({ employeeId: id });
const { data: trainingCount } = await useGetMemberTrainingCount({ employeeId: id });

const { data: honorTrendData } = await useGetMemberHonorTrendData({ employeeId: id });
const { data: honorTypeData } = await useGetMemberHonorTypeData({ employeeId: id });
const { data: honorLevelData } = await useGetMemberHonorLevelData({ employeeId: id });
const { data: radarData } = await useGetMemberRadarData({ employeeId: id });

const lineChartOption = {
  title: {
    text: '近五年荣誉数'
  },
  xAxis: {
    type: 'category',
    data: Object.keys(honorTrendData.value)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '荣誉数',
      data: Object.values(honorTrendData.value),
      type: 'line'
    }
  ],
  tooltip: {
    trigger: 'axis',
  }
};

const barChartOption = {
  title: {
    text: '各荣誉类别分布'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {},

  yAxis: {
    type: 'value'
  },
  xAxis: {
    type: 'category',
    data: Object.keys(honorTypeData.value)
  },
  series: [
    {
      name: '荣誉类别',
      type: 'bar',
      data: Object.values(honorTypeData.value)
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
      data: Object.entries(honorLevelData.value).map(([key, value]) => ({ value: value, name: key })),
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

const radarOption = {
  title: {
    text: '个人维度数据'
  },
  radar: {
    // shape: 'circle',
    indicator: Object.keys(radarData.value).map(key => ({ name: key }))
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: Object.values(radarData.value),
          label: {
            show: true,
          },
          areaStyle: {
            color: 'rgba(116, 142, 222, .5)'
          }
        }
      ]
    }
  ],
  tooltip: {}
};
</script>