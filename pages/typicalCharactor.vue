<template>
  <el-tabs>
    <el-tab-pane label="大队典型" lazy>
      <Manage
        ref="level0ManageRef"
        composable-path="typicalCharactor-level-0"
        :table-column-props="tableColumnsProps"
        :query-form="queryForm"
      >
        <template #query>
          <el-form inline>
            <el-form-item label="姓名"><AutoComplete v-model="queryForm.employeeName" query-target="EmployeeName" /></el-form-item>
            <el-form-item label="部门"><Select v-model="queryForm.departmentName" select-target="DepartmentTree" is-tree /></el-form-item>
            <el-form-item>
              <el-button :icon="ElIconSearch" type="primary" @click="level0ManageRef?.queryData(queryForm)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="level0ManageRef?.restoreQuery(queryForm)">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn>
          <el-table-column label="操作" align="center" width="480px">
            <template #default="scope">
              <el-popconfirm  title="确定升级为支队典型吗" width="240px" @confirm="handlePromote(scope)" v-if="isAdmin">
                <template #reference>
                  <el-button type="success" :icon="ElIconArrowUpBold" round text>升级</el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm  title="确定取消大队典型吗" width="240px" @confirm="handleDemote(scope)">
                <template #reference>
                  <el-button type="danger" :icon="ElIconCloseBold" round text>取消</el-button>
                </template>
              </el-popconfirm >
              <el-button :icon="ElIconEdit" type="primary" @click="handleEdit(scope)" text round>编辑典型</el-button>
              <el-button :icon="ElIconView" type="info" @click="handleView(scope)" text round>查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
    <el-tab-pane label="支队典型" lazy>
      <Manage
        ref="level1ManageRef"
        composable-path="typicalCharactor-level-1"
        :table-column-props="tableColumnsProps"
        :query-form="queryForm"
      >
        <template #query>
          <el-form inline>
            <el-form-item label="姓名"><AutoComplete v-model="queryForm.employeeName" query-target="EmployeeName" /></el-form-item>
            <el-form-item label="部门"><Select v-model="queryForm.departmentName" select-target="DepartmentTree" is-tree /></el-form-item>
            <el-form-item>
              <el-button :icon="ElIconSearch" type="primary" @click="level1ManageRef?.queryData(queryForm)">查询</el-button>
              <el-button :icon="ElIconRefresh" @click="level1ManageRef?.restoreQuery(queryForm)">重置</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template #tableOperationColumn v-if="isAdmin">
          <el-table-column label="操作" align="center" width="480px">
            <template #default="scope">
              <el-popconfirm title="确定降级为大队典型吗？" width="240px" @confirm="handleDemote(scope)">
                <template #reference>
                  <el-button type="danger" :icon="ElIconArrowDownBold" round text>降级</el-button>
                </template>
              </el-popconfirm>
              <el-button :icon="ElIconEdit" type="primary" @click="handleEdit(scope)" text round>编辑典型</el-button>
              <el-button :icon="ElIconView" type="info" @click="handleView(scope)" text round>查看详情</el-button>
            </template>
          </el-table-column>
        </template>
      </Manage>
    </el-tab-pane>
  </el-tabs>
  <TypicalDisplayDialog target="charactor" v-model="dialogVisible" :id="currentId" />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';

import Manage from '@/components/Manage.vue';

import type { ElTableRowScope } from '@/composables/use-api-types';

definePageMeta({
  middleware: 'auth'
});

const tableColumnsProps = tableColumnPropsMap['/typicalCharactor'];

const isAdmin = useAdmin();

const currentId = ref(0);
const dialogVisible = ref(false);

const queryForm = reactive({
  employeeName: '',
  departmentName: ''
});

const level0ManageRef = ref<InstanceType<typeof Manage>>();
const level1ManageRef = ref<InstanceType<typeof Manage>>();

const handleView = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await navigateTo(`/memberDetail?id=${id}`);
};

const handleEdit = (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  (currentId.value = id) && (dialogVisible.value = true);
};

const handlePromote = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await usePromoteAwardedMemberLevel({ employeeId: id });
  level0ManageRef.value?.refreshData();
  level1ManageRef.value?.refreshData();
  ElMessage({ type: 'success', message: '升级成功' });
};

const handleDemote = async (scope: ElTableRowScope) => {
  const { row: { id } } = scope;
  await useDemoteAwardedMemberLevel({ employeeId: id });
  level0ManageRef.value?.refreshData();
  level1ManageRef.value?.refreshData();
  ElMessage({ type: 'success', message: '降级成功' });
};

</script>