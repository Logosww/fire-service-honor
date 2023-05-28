<template>
  <div class="basic-info-container">
    <el-row :gutter="40">
      <el-col :span="16">
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
            <el-image :src="profile.employeeAvatar" :preview-src-list="[profile.employeeAvatar]" style="border-radius: 4px;" fit="cover" />
          </el-descriptions-item>
          <el-descriptions-item label="典型风采">
            <el-carousel height="300px" style="border-radius: 4px;" autoplay>
              <el-carousel-item v-for="(item, index) in profile.employeeLifePhoto" :key="index">
                <el-image :src="item" fit="cover" style="width: 100%; height: 100%;" />
              </el-carousel-item>
            </el-carousel>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="8">
        <Chart style="margin: 0; height: 398px;" :option="radarOption" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  id: number;
}>();

const { id } = props;

const { data: profile } = await useGetMemberProfile({ employeeId: id });
const { data: radarData } = await useGetMemberRadarData({ employeeId: id });

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
      name: '个人维度数据',
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

<style lang="scss">
  @use '@/assets/style/components/basic-info.scss' as *;
</style>