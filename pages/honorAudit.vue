<template>
  <el-tabs v-model="activeTab" @tab-change="handleTabChange">
    <el-tab-pane label="待审核">
      <Manage
        ref="undealtManageRef"
        composable-path="/honorAudit/undealt"
        :table-column-props="undealtTableColumnProps"
        multiple-select
      >
        <template #query>
          <el-form inline>
            <el-form-item label="荣誉者类别">
              <Select v-model="undealtQueryForm.honorPersonType" select-target="荣誉者类别" />
            </el-form-item>
            <el-form-item label="荣誉获得者">
              <AutoComplete v-model="undealtQueryForm.honorPerson" query-target="EmployeeName" />
            </el-form-item>
            <el-form-item label="荣誉名称">
              <Select v-model="undealtQueryForm.honorName" select-target="荣誉名称类别" filterable />
            </el-form-item>
            <el-form-item label="荣誉级别">
              <Select v-model="undealtQueryForm.honorLevel" select-target="荣誉级别" />
            </el-form-item>
            <el-form-item label="起止时间">
              <ClientOnly>
                <el-date-picker
                  v-model="undealtQueryForm.timeRange"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :shortcuts="datePickerShortcuts"
                />
              </ClientOnly>
            </el-form-item>
            <el-form-item>
              <el-button :icon="ElIconSearch" type="primary" @click="handleQuery(undealtQueryForm, undealtManageRef!)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="undealtManageRef?.restoreQuery(undealtQueryForm)">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn>
          <el-table-column label="操作" width="120" align="center">
            <template #default="scope">
              <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>审核</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
    <el-tab-pane label="已审核">
      <Manage
        ref="dealtManageRef"
        composable-path="/honorAudit/dealt"
        :table-column-props="dealtTableColumnProps"
        multiple-select
      >
        <template #query>
          <el-form inline>
            <el-form-item label="荣誉者类别">
              <Select v-model="dealtQueryForm.honorPersonType" select-target="荣誉者类别" />
            </el-form-item>
            <el-form-item label="荣誉获得者">
              <AutoComplete v-model="dealtQueryForm.honorPerson" query-target="EmployeeName" />
            </el-form-item>
            <el-form-item label="荣誉名称">
              <Select v-model="dealtQueryForm.honorName" select-target="荣誉名称类别" filterable />
            </el-form-item>
            <el-form-item label="荣誉级别">
              <Select v-model="dealtQueryForm.honorLevel" select-target="荣誉级别" />
            </el-form-item>
            <el-form-item label="起止时间">
              <ClientOnly>
                <el-date-picker
                  v-model="dealtQueryForm.timeRange"
                  type="daterange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :shortcuts="datePickerShortcuts"
                />
              </ClientOnly>
            </el-form-item>
            <el-form-item>
              <el-button :icon="ElIconSearch" type="primary" @click="handleQuery(dealtQueryForm, dealtManageRef!)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="dealtManageRef?.restoreQuery(dealtQueryForm)">重置</el-button>
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
    </el-tab-pane>
  </el-tabs>
  <HonorApplicationDialog v-model="dialogVisible" :status="applicationStatus" @update:status="handleSubmit" :id="applicationId"/>
</template>

<script lang="ts" setup>
import { datePickerShortcuts, tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';
import { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: ['auth', 'admin']
});

const undealtTableColumnProps = tableColumnPropsMap['/honorAudit/undealt'];
const dealtTableColumnProps = tableColumnPropsMap['/honorAudit/dealt'];

const activeTab = ref('0');
const dialogVisible = ref(false);
const applicationId = ref(0);
const applicationStatus = ref<
  '待处理' | '通过' | '退回'
>('待处理');

const undealtManageRef = ref<InstanceType<typeof Manage>>();
const dealtManageRef = ref<InstanceType<typeof Manage>>();

const undealtQueryForm = reactive({
  honorPersonType: '',
  honorPerson: '',
  honorName: '',
  honorLevel: '',
  honorType: '',
  timeRange: ''
});
const dealtQueryForm = reactive({
  honorPersonType: '',
  honorPerson: '',
  honorName: '',
  honorLevel: '',
  honorType: '',
  timeRange: ''
});

const handleTabChange = (tab: string) => {
  const manageRef = tab === '0' ? undealtManageRef : dealtManageRef;
  manageRef.value?.refreshData();
};

const handleQuery = (
  queryForm: Record<string, any>, 
  manageRef: InstanceType<typeof Manage>
) => {
  const form = {
    ...queryForm,
    timeRange: '',
    startTime: queryForm.timeRange[0] ?? '',
    endTime: queryForm.timeRange[1] ?? ''
  };
  manageRef?.queryData(form);
};

const handleView = (scope: ElTableRowScope) => {
  const { row: { id, auditStatus: status } } = scope;
  applicationStatus.value = status;
  applicationId.value = id;
  dialogVisible.value = true;
};

const handleSubmit = (status: '待处理' | '通过' | '退回') => {
  applicationStatus.value = status;
  undealtManageRef.value?.refreshData();
};
</script>

<style lang="scss">
  @use '@/assets/style/honor-audit' as *;
</style>