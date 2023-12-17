<template>
  <div class="detail-container">
    <BasicInfo :id="id" />
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="岗位履历" name="岗位履历" lazy>
        <JobHistory :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="重大经历" name="重大经历" lazy>
        <Experience :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="荣耀之路" name="荣耀之路" lazy>
        <HonorRoute :id="id" />
      </el-tab-pane>
      <el-tab-pane label="能力跃升" name="能力跃升" lazy>
        <Training :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="典型路线" name="典型路线" lazy>
        <Typical :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" />
      </el-tab-pane>
      <el-tab-pane label="个人事迹" name="个人事迹" lazy>
        <Deed :id="id" />
      </el-tab-pane>
      <el-tab-pane label="视频集锦" name="视频集锦" lazy>
        <VideoCollection :id="id" />
      </el-tab-pane>
    </el-tabs>
  </div>
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
        <el-button :icon="ElIconCheck" type="primary" @click="handleConfirm">确认</el-button>
        <el-button :icon="ElIconClose" @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
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

const dialogVisible = ref(false);
const dialogTitle = ref();

const formId = ref(0);
const formComponent = shallowRef<Component>();
const formData = ref<FormData>();
const formCompRef = shallowRef();

const activeTab = computed(() => route.hash.slice(1) || '岗位履历');

const eventBus = useEventBus(eventBusKey);

const handleAppend = (formComp: Component, name: string) => {
  dialogTitle.value = `添加${name}`;
  formId.value = 0;
  formData.value = undefined;
  formComponent.value = formComp;
  dialogVisible.value = true;
};

const handleModify = (formComp: Component, data: FormData, name: string) => {
  dialogTitle.value = `编辑${name}`;
  const { id } = data;
  formId.value = id;
  formData.value = data;
  formComponent.value = formComp;
  dialogVisible.value = true;
};

const handleDelete = (form: string, id: number, name: string) => {
  ConfirmDelete(name, () => {
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

const handleTabChange = (tabName: string | number) => {
  window.location.hash = tabName as string;
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
  @use '@/assets/style/detail' as *;
</style>