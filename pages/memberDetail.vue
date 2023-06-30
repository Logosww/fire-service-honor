<template>
  <div class="member-detail-container">
    <BasicInfo :id="id" />
    <el-tabs v-model="activeTab">
      <el-tab-pane label="岗位履历">
        <JobHistory :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="重大经历">
        <Experience :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="荣耀之路">
        <HonorRoute :id="id" />
      </el-tab-pane>
      <el-tab-pane label="能力跃升">
        <Training :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="典型路线">
        <Typical :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="个人事迹">
        <PersonalDeed :id="id" />
      </el-tab-pane>
      <el-tab-pane label="视频集锦">
        <VideoCollection :id="id" />
      </el-tab-pane>
    </el-tabs>
    <ClientOnly>
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500"
        @closed="formComponent = undefined"
        align-center
      >
        <component ref="formCompRef" :is="formComponent" :id="formId" :data="formData"></component>
        <template #footer>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { eventBusKey, eventBusContextKey } from '@/tokens';

import type { FormInstance } from 'element-plus';

export type FormData = Record<string, any> & { id: number };

definePageMeta({
  middleware: 'auth'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);

const activeTab = ref('0');
const dialogVisible = ref(false);
const dialogTitle = ref();

const formId = ref(0);
const formComponent = shallowRef<Component>();
const formData = ref<FormData>();
const formCompRef = shallowRef();

const eventBus = useEventBus(eventBusKey);

const handleAppend = (formComp: Component) => {
  dialogTitle.value = '添加';
  formId.value = 0;
  formData.value = undefined;
  formComponent.value = formComp;
  dialogVisible.value = true;
};

const handleModify = (formComp: Component, data: FormData) => {
  dialogTitle.value = '编辑';
  const { id } = data;
  formId.value = id;
  formData.value = data;
  formComponent.value = formComp;
  dialogVisible.value = true;
};

const handleDelete = (form: string, id: number) => {
  ConfirmDelete('', () => {
    eventBus.emit(['delete', form, id]);
  });
};

const handleConfirm = () => {
  const { formRef } = formCompRef.value;
  (formRef as FormInstance).validate(valid => {
    if(!valid) return;

    eventBus.emit(['confirm', id]);
  });
};

eventBus.on(([event]) => {
  if(event !== 'submit') return;
  
  dialogVisible.value = false;
  if(formId.value) ElMessage({ type: 'success', message: '编辑成功' });
  else ElMessage({ type: 'success', message: '添加成功' });
});

provide(eventBusContextKey, eventBus);

</script>

<style lang="scss">
  @use '@/assets/style/member-detail' as *;
</style>