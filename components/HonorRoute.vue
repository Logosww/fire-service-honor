<template>
  <BasicTable
    :tableColumnProps="honorRouteColumnProps"
    :data="honorRouteData"
    title="荣耀之路"
    read-only
  >
    <template #customOperations="{ scope }">
      <el-button type="primary" :icon="ElIconView" :disabled="!scope.row.honorPhoto" @click="handleViewImage(scope)" text round >查看图片</el-button>
    </template>
  </BasicTable>
  <el-image-viewer v-if="showImageViewer" :url-list="picList" @close="showImageViewer = false" />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';

import type { ElTableRowScope } from '@/composables/use-api-types';


const honorRouteColumnProps = tableColumnPropsMap['honorRoute'];

const props = defineProps<{ id: number }>();
const { id } = props;

const { data: honorRouteData } = await useGetHonorRoute({ employeeId: id });

const showImageViewer= ref(false);
const picList = ref<string[]>([]);

const handleViewImage = (scope: ElTableRowScope) => {
  const { row: { honorPhoto } } = scope;
  console.log(scope, honorPhoto)
  picList.value[0] = honorPhoto as string;
  showImageViewer.value = true;
};

</script>