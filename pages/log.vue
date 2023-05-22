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
          <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>查看详情</el-button>
        </template>
      </el-table-column>
    </template>
  </Manage>
</template>

<script lang="ts" setup>
import { datePickerShortcuts, tableColumnPropsMap } from '@/constants';
import Manage from '@/components/Manage.vue';

import type { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const tableColumnProps = tableColumnPropsMap['/log'];
const manageRef = ref<InstanceType<typeof Manage>>();

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

const handleView = (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  
};
</script>