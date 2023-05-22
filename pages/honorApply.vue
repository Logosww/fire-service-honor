<template>
  <el-tabs v-model="activeTab" @tab-change="handleTabChange">
    <el-tab-pane label="待审核">
      <Manage
        ref="undealtManageRef"
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
              <el-button :icon="ElIconSearch" type="primary" @click="undealtManageRef?.queryData(undealtQueryForm)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="undealtManageRef?.restoreQuery(undealtQueryForm)">重置</el-button>
              <el-button :icon="ElIconPlus" type="primary" @click="(honorVisible = true) && (applicationId = 0)" text round>申请荣誉</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn>
          <el-table-column label="操作" width="350" align="center">
            <template #default="scope">
              <el-button :icon="ElIconCloseBold" type="danger" @click="handleCancel(scope)">撤销</el-button>
              <el-button :icon="ElIconEdit" type="primary" @click="handleModify(scope)">编辑</el-button>
              <el-button :icon="ElIconView" type="primary" @click="handleView(scope)" text round>查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
    <el-tab-pane label="已审核">
      <Manage
        ref="dealtManageRef"
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
              <el-button :icon="ElIconSearch" type="primary" @click="dealtManageRef?.queryData(dealtQueryForm)">查询</el-button>
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
  <HonorApplicationDialog v-model="applicationVisible" :status="applicationStatus" :id="applicationId"/>
  <HonorDialog v-model="honorVisible" :honor-id="applicationId" @submit="handleSubmit" is-apply />
</template>

<script lang="ts" setup>
import { datePickerShortcuts, tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';
import { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const undealtTableColumnProps = tableColumnPropsMap['/honorApply/undealt'];
const dealtTableColumnProps = tableColumnPropsMap['/honorApply/dealt'];

const activeTab = ref('0');
const applicationVisible = ref(false);
const honorVisible = ref(false);
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
    undealtManageRef.value?.refreshData();
    ElMessage({ type: 'success', message: '删除成功' });
  })
};

const handleModify = (scope: ElTableRowScope) => {
  const { row: { id, auditStatus: status } } = scope;
  applicationId.value = id;
  honorVisible.value = true;
};

const handleSubmit = async (form: Record<string, any>) => {
  const { value: id } = applicationId;
  id
    ? await useModifyApplication({ id, ...form })
    : await useSubmitApplication(form);
  undealtManageRef.value?.refreshData();
  ElMessage({ type: 'success', message: id ? '编辑成功' : '申请成功' });
  honorVisible.value = false;
};
</script>