<template>
  <el-card :class="['charactor-card', clickable ? 'is-clickable' : '']" :style="{ height }">
    <el-row>
      <el-col :span="10">
        <div class="charactor-pic">
          <el-image :src="detail.typicalEmployeePhoto" fit="cover" :preview-src-list="[detail.typicalEmployeePhoto]" preview-teleported @click.stop>
            <template #error>
              <img style="height: 100%; object-fit: cover;" src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/default-typical.png" />
            </template>
          </el-image>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="charactor-info">
          <div class="charactor-info-top">
            <h1 class="charactor-name">{{ detail.employeeName }}</h1>
            <h4><el-icon style="margin-right: 10px;"><ElIconCollectionTag /></el-icon>{{ detail.employeePosition }}</h4>
            <h4><el-icon style="margin-right: 10px;"><ElIconHouse /></el-icon>{{ detail.employeeDepartmentName }}</h4>
            <h4 v-if="detail.typicalHonors.length"><el-icon style="margin-right: 8px;"><ElIconTrophy /></el-icon>
              <ul class="charactor-honors">
                <li v-for="(item, index) in detail.typicalHonors.slice(0, 3)" :key="index">{{ item }}</li>
              </ul>
            </h4>
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
import type { ECOption } from './ChartContent.vue';

const { detail: { radarMap: radar } } = defineProps<{
  detail: AwardedMemberDisplayDetail;
  clickable?: boolean;
  height?: string;
}>();

const radarMax = Object.values(radar).sort((prev, curr) => curr - prev).at(0)! * 1.25;

const radarOption = computed<ECOption>(() => radar && {
  radar: {
    indicator: Object.keys(radar).map(key => ({ name: key, max: radarMax }))
  },
  series: [
    {
      type: 'radar',
      name: '个人维度数据',
      data: [
        {
          value: Object.values(radar),
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
});
</script>

<style lang="scss">
  @use '@/assets/style/components/charactor-card' as *;
</style>