<template>
  <div class="basic-table-title">
    <span class="basic-table-title__bar"></span>
    <h3 class="basic-table-title__content">个人事迹</h3>
    <div v-if="!isIndex && content">
      <el-button-group>
        <el-button :icon="ElIconEdit" type="primary" @click="navigateTo(`/personalDeed?id=${id}`)" text bg round>编辑</el-button>
        <el-button :icon="ElIconDelete" type="danger" @click="handleClick" text bg round>删除</el-button>
      </el-button-group>
    </div>
  </div>
  <div style="border: 1px solid var(--el-border-color); background-color: #fff; border-radius: 4px; padding: 10px 50px;" v-html="content" v-if="content"></div>
  <el-empty :image-size="150" v-else>
    <el-button type="primary" :icon="ElIconPlus" @click="navigateTo(`/personalDeed?id=${id}`)" v-if="!isIndex">新增</el-button>
  </el-empty>
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