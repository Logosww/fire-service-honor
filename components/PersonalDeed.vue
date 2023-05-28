<template>
  <div style="width: 100%;">
    <div v-if="content">
      <el-button :icon="ElIconEdit" type="primary" @click="navigateTo(`/personalDeed?id=${id}`)">编辑</el-button>
      <el-button :icon="ElIconDelete" type="danger" @click="handleClick">删除</el-button>
      <el-divider />
    </div>
    <div v-html="content" v-if="content"></div>
    <el-empty :image-size="240" v-else>
      <el-button type="primary" :icon="ElIconPlus" @click="navigateTo(`/personalDeed?id=${id}`)">新增</el-button>
    </el-empty>
  </div>
</template>

<script lang="ts" setup>
import { useGetPersonalDeed } from '~/composables/use-api';


const props = defineProps<{ id: number }>();
const { id } = props;

const { data: content } = await useGetPersonalDeed({ employeeId: id });

const handleClick = () => {
  ConfirmDelete('个人事迹', async () => {
    await useDeletePersonalDeed({ employeeId: id });
    content.value = '';
    ElMessage({ type: 'success', message: '删除成功' });
  })
};
</script>