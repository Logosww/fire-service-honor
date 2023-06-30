<template>
  <el-card :class="['charactor-card', clickable ? 'is-clickable' : '']" :style="{ height }">
    <el-row>
      <el-col :span="11">
        <div class="charactor-pic">
          <el-image style="height: 100%;" :src="detail.typicalEmployeePhoto" fit="cover" :preview-src-list="[detail.typicalEmployeePhoto]" preview-teleported @click.stop />
        </div>
      </el-col>
      <el-col :span="13">
        <div class="charactor-info">
          <div class="charactor-info-top">
            <h1 class="charactor-name">{{ detail.employeeName }}</h1>
            <span>{{ detail.employeePosition }}</span>
            <h4><el-icon style="margin-right: 10px;"><ElIconHouse /></el-icon>{{ detail.employeeDepartmentName }}</h4>
            <h4><el-icon style="margin-right: 10px;"><ElIconTrophy /></el-icon>{{ detail.typicalHonors.slice(0, 3).join(' ') }}</h4>
          </div>
          <div class="charactor-radar">
            <ChartContent :option="radarOption" />
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>

import type { AwardedMemberDisplayDetail } from '@/composables/use-api-types';

const props = defineProps<{
  detail: AwardedMemberDisplayDetail;
  clickable?: boolean;
  height?: string;
}>();
const { detail } = props;

const radarOption = {
  radar: {
    indicator: Object.keys(detail.radarMap).map(key => ({ name: key }))
  },
  series: [
    {
      type: 'radar',
      name: '个人维度数据',
      data: [
        {
          value: Object.values(detail.radarMap),
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

<style lang="scss">
  @use '@/assets/style/components/charactor-card' as *;
</style>