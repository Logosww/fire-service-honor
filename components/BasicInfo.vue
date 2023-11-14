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
            <el-image :src="profile.employeeAvatar" :preview-src-list="[profile.employeeAvatar]" style="border-radius: 4px; display: block; margin: 0 auto;" fit="contain" />
          </el-descriptions-item>
          <el-descriptions-item label="典型风采">
            <el-carousel height="300px" style="border-radius: 4px;" autoplay>
              <el-carousel-item v-for="(item, index) in profile.employeeLifePhoto" :key="index">
                <el-image :src="item" fit="cover" style="width: 100%; height: 100%;" :preview-src-list="profile.employeeLifePhoto" :initial-index="index" preview-teleported />
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
  <teleport to='#is-awarded-wrapper'>
    <el-text tag="span" style="user-select: none; margin-right: 10px;"><el-icon style="margin-right: 5px;"><ElIconTrophy/></el-icon>设为大队典型</el-text>
    <el-switch style="margin-right: 30px;" v-model="isAwarded" :loading="isSwitching" :before-change="handleIsAwardedChange" inline-prompt :active-icon="ElIconCheck" :inactive-icon="ElIconClose" />
  </teleport>
</template>

<script lang="ts" setup>
import type { ECOption } from './ChartContent.vue';

const props = defineProps<{
  id: number;
}>();

const { id } = props;

const { data: profile } = await useGetMemberProfile({ employeeId: id });

const isSwitching = ref(false);
const isAwarded = computed(() => profile.value?.typicalLevel >= 0);

const handleIsAwardedChange = () => {
  isSwitching.value = true;
  if(isAwarded.value) {
    if(profile.value.typicalLevel) 
      return ElMessageBox.alert('此人已被设为更高等级的典型人物，请在典型管理中进行降级和取消。', '提示', { icon: markRaw(ElIconInfoFilled) })
        .then(() => false)
        .finally(() => isSwitching.value = false);
    else return ElMessageBox.confirm('确定取消大队典型吗？', '提示').then(async() => {
      await useDemoteAwardedMemberLevel({ employeeId: id });
      ElMessage({ type: 'success', message: '取消成功' });
      return true;
    }).finally(() => isSwitching.value = false);
  }
  else return ElMessageBox.confirm('确定将其设为大队典型吗?', '提示').then(async () => {
    await useSetMemberAwarded({ employeeId: id });
    ElMessage({ type: 'success', message: '设置成功' });
    return true;
  }).finally(() => isSwitching.value = false);
};

const radarOption = computed<ECOption>(() => (profile.value?.radar && {
  title: {
    text: '个人维度数据'
  },
  radar: {
    indicator: Object.keys(profile.value.radar).map(key => ({ name: key }))
  },
  series: [
    {
      type: 'radar',
      name: '个人维度数据',
      data: [
        {
          value: Object.values(profile.value.radar),
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
}));
</script>

<style lang="scss">
  @use '@/assets/style/components/basic-info.scss' as *;
</style>