<template>
  <el-tabs v-model="activeTab" @tab-change="handleTabChange">
    <el-tab-pane label="提交记录" lazy>
      <Manage
        ref="manageRef"
        composable-path="/honorAudit/undealt"
        :table-column-props="undealtTableColumnProps"
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
                  type="monthrange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM"
                  :shortcuts="monthPickerShortcuts"
                />
              </ClientOnly>
            </el-form-item>
            <el-form-item>
              <el-button :icon="ElIconSearch" type="primary" @click="handleQuery(undealtQueryForm, manageRef!)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(undealtQueryForm)">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn>
          <el-table-column label="操作" width="300" align="center">
            <template #default="scope">
              <el-popconfirm title="确认退回该申请吗？" width="200px" @confirm="handleReturn(scope)">
                <template #reference>
                  <el-button :icon="ElIconCloseBold" type="danger" text round>退回</el-button>
                </template>
              </el-popconfirm>
              <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
    <el-tab-pane label="退回记录" lazy>
      <Manage
        ref="returnManageRef"
        composable-path="/honorAudit/dealt"
        :table-column-props="dealtTableColumnProps"
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
                  type="monthrange"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM"
                  :shortcuts="monthPickerShortcuts"
                />
              </ClientOnly>
            </el-form-item>
            <el-form-item>
              <el-button :icon="ElIconSearch" type="primary" @click="handleQuery(dealtQueryForm, returnManageRef!)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="returnManageRef?.restoreQuery(dealtQueryForm)">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn>
          <el-table-column label="操作" width="300" align="center">
            <template #default="scope">
              <el-popconfirm title="确认恢复该申请吗？" width="200px" @confirm="handleRecover(scope)">
                <template #reference>
                  <el-button :icon="ElIconRefreshLeft" type="warning" text round>恢复</el-button>
                </template>
              </el-popconfirm>
              <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
  </el-tabs>
  <HonorApplicationDialog v-model="dialogVisible" :status="applicationStatus" :id="applicationId"/>
</template>

<script lang="ts" setup>
import { monthPickerShortcuts, tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';
import type { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: ['auth', 'admin']
});

const undealtTableColumnProps = tableColumnPropsMap['/honorAudit/undealt'];
const dealtTableColumnProps = tableColumnPropsMap['/honorAudit/dealt'];

const activeTab = ref('0');
const dialogVisible = ref(false);
const applicationId = ref(0);
const applicationStatus = ref<'通过' | '退回'>('通过');

const manageRef = ref<InstanceType<typeof Manage>>();
const returnManageRef = ref<InstanceType<typeof Manage>>();

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

const handleTabChange = (tab: string | number) => {
  const ref = tab === '0' ? manageRef : returnManageRef;
  ref.value?.refreshData();
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

const handleReturn = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await useReturnApplication({ honorApplyId: id });
  manageRef.value?.refreshData();  
  ElMessage({ type: 'success', message: '退回成功' });
};

const handleRecover = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await useRecoverApplication({ honorApplyId: id });
  returnManageRef.value?.refreshData(); 
  ElMessage({ type: 'success', message: '恢复成功' });
};
</script>

<style lang="scss">
  @use '@/assets/style/honor-audit' as *;
</style>