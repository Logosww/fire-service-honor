<template>
  <div style="width: 100%;">
    <div v-if="!isIndex && content">
      <el-button-group>
        <el-button :icon="ElIconEdit" type="primary" @click="navigateTo(`/personalDeed?id=${id}`)" text round>编辑</el-button>
        <el-button :icon="ElIconDelete" type="danger" @click="handleClick" text round>删除</el-button>
      </el-button-group>
      <el-divider />
    </div>
    <div v-html="content" v-if="content"></div>
    <el-empty :image-size="150" v-else>
      <el-button type="primary" :icon="ElIconPlus" @click="navigateTo(`/personalDeed?id=${id}`)" v-if="!isIndex">新增</el-button>
    </el-empty>
  </div>
</template>

<script lang="ts" setup>
import { useGetPersonalDeed } from '~/composables/use-api';


const props = defineProps<{ id: number }>();
const { id } = props;

const isIndex = useRoute().path.startsWith('/display');

const { data: content } = await useGetPersonalDeed({ employeeId: id });

const handleClick = () => {
  ConfirmDelete('个人事迹', async () => {
    await useDeletePersonalDeed({ employeeId: id });
    content.value = '';
    ElMessage({ type: 'success', message: '删除成功' });
  })
};
</script>