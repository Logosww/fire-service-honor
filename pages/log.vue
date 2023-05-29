<template>
  <Manage
    ref="manageRef"
    :table-column-props="tableColumnProps"
    hide-index
  >
    <template #query>
      <el-form inline>
        <el-form-item label="起止日期">
          <ClientOnly>
            <el-date-picker
              v-model="queryForm.datetimeRange"
              type="datetimerange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD HH:mm:ss"
              :shortcuts="datePickerShortcuts"
            />
          </ClientOnly>
        </el-form-item>
        <el-form-item label="操作者">
          <AutoComplete v-model="queryForm.operator" query-target="UserName" />
        </el-form-item>
        <el-form-item label="操作类型">
          <Select v-model="queryForm.type" select-target="日志类别" />
        </el-form-item>
        <el-form-item>
          <el-button :icon="ElIconSearch" type="primary" @click="handleQuery">查询</el-button>
          <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(queryForm)">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #tableOperationColumn>
      <el-table-column label="操作" width="150" align="center">
        <template #default="scope">
          <el-button :icon="ElIconView" type="primary" @click="e => handleView(e, scope)" text round>查看详情</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
  <ClientOnly>
    <el-popover
      ref="detailRef"
      width="500"
      :visible="detailVisible"
      popper-class="log-detail"
      placement="bottom-end"
      transition="slide-up"
      :hide-after="0"
      :virtual-ref="detailTriggerRef"
      @hide="detailTriggerRef = undefined"
      virtual-triggering
    >
     <el-descriptions :column="2" v-loading="isLoading" border>
      <el-descriptions-item label="操作用户名">{{ detail?.operaUsername }}</el-descriptions-item>
      <el-descriptions-item label="部门名称">{{ detail?.departmentName }}</el-descriptions-item>
      <el-descriptions-item label="是否超级管理员权限">{{ detail?.isAdmin }}</el-descriptions-item>
      <el-descriptions-item label="操作模块">{{ detail?.operaModule }}</el-descriptions-item>
      <el-descriptions-item label="操作类型">{{ detail?.operaType }}</el-descriptions-item>
      <el-descriptions-item label="操作描述">{{ detail?.operaDescription }}</el-descriptions-item>
      <el-descriptions-item label="操作结果">{{ detail?.result }}</el-descriptions-item>
      <el-descriptions-item label="操作时间">{{ detail?.operaTime }}</el-descriptions-item>
     </el-descriptions>
    </el-popover>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { datePickerShortcuts, tableColumnPropsMap } from '@/constants';
import Manage from '@/components/Manage.vue';

import type { ElTableRowScope, LogDetail } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const tableColumnProps = tableColumnPropsMap['/log'];

const isLoading = ref(false);
const detailVisible = ref(false);
const detailRef = ref();
const detail = ref<LogDetail>();
const detailTriggerRef = ref();
const manageRef = ref<InstanceType<typeof Manage>>();

onClickOutside(detailRef, () => detailVisible.value && (detailVisible.value = false));

const queryForm = reactive({
  datetimeRange: '',
  operator: '',
  type: ''
});

const handleQuery = () => {
  const form = {
    ...queryForm,
    datetimeRange: '',
    startTime: queryForm.datetimeRange[0] ?? '',
    endTime: queryForm.datetimeRange[1] ?? ''
  };
  manageRef.value?.queryData(form);
};

const handleView = async (e: MouseEvent, scope: ElTableRowScope) => {
  const { target } = e;
  const { row: { id } } = scope;
  detailTriggerRef.value = target!;
  setTimeout(() => detailVisible.value = true);
  isLoading.value = true;
  detail.value = await useGetLogDetail({ logId: id });
  isLoading.value = false;
};
</script>

<style lang="scss">
  @use '@/assets/style/log' as *;
</style>