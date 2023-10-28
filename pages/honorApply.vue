<template>
  <el-tabs v-model="activeTab" @tab-change="handleTabChange">
    <el-tab-pane label="提交记录">
      <Manage
        ref="manageRef"
        composable-path="/honorApply/undealt"
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
              <el-button :icon="ElIconSearch" type="primary" @click="manageRef?.queryData(undealtQueryForm)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="manageRef?.restoreQuery(undealtQueryForm)">重置</el-button>
              <el-button :icon="ElIconPlus" type="primary" @click="(honorVisible = true) && (applicationId = 0)" text round>申请荣誉</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn>
          <el-table-column label="操作" width="350" align="center">
            <template #default="scope">
              <el-popconfirm title="确认撤销该申请吗？" width="200px" @confirm="handleCancel(scope)">
                <template #reference>
                  <el-button :icon="ElIconCloseBold" type="danger" text round>撤销</el-button>
                </template>
              </el-popconfirm>
              <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
    <el-tab-pane label="退回记录">
      <Manage
        ref="returnedManageRef"
        composable-path="/honorApply/dealt"
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
              <el-button :icon="ElIconSearch" type="primary" @click="returnedManageRef?.queryData(dealtQueryForm)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="returnedManageRef?.restoreQuery(dealtQueryForm)">重置</el-button>
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
  <HonorApplicationDialog v-model="applicationVisible" :status="applicationStatus" :id="applicationId"/>
  <HonorDialog v-model="honorVisible" :honor-id="applicationId" @submit="handleSubmit" is-apply />
</template>

<script lang="ts" setup>
import { datePickerShortcuts, tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';
import type { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const undealtTableColumnProps = tableColumnPropsMap['/honorApply/undealt'];
const dealtTableColumnProps = tableColumnPropsMap['/honorApply/dealt'];

const activeTab = ref('0');
const applicationVisible = ref(false);
const honorVisible = ref(false);
const applicationId = ref(0);
const applicationStatus = ref<'通过' | '退回'>('通过');

const manageRef = ref<InstanceType<typeof Manage>>();
const returnedManageRef = ref<InstanceType<typeof Manage>>();

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
  const ref = tab === '0' ? manageRef : returnedManageRef;
  ref.value?.refreshData();
};

const handleView = (scope: ElTableRowScope) => {
  const { row: { id, auditStatus: status } } = scope;
  applicationStatus.value = status;
  applicationId.value = id;
  applicationVisible.value = true;
};

const handleCancel = (scope: ElTableRowScope) => {
  const { row: { id: honorApplyId } } = scope;
  ConfirmDelete('荣誉申请', async () => {
    await useCancelApplication({ honorApplyId });
    manageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '删除成功' });
  })
};

const handleSubmit = async (form: Record<string, any>) => {
  await useSubmitApplication(form);
  manageRef.value?.refreshData();
  ElMessage({ type: 'success', message: '申请成功' });
  honorVisible.value = false;
};
</script>