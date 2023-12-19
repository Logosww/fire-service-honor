<template>
  <div class="detail-container">
    <el-descriptions title="基本信息" border>
      <el-descriptions-item label="名称">{{ profile.departmentName }}</el-descriptions-item>
      <el-descriptions-item label="上级部门">{{ profile.departmentParent }}</el-descriptions-item>
      <el-descriptions-item label="负责人">{{ profile.departmentLeader }}</el-descriptions-item>
      <el-descriptions-item label="集体照片">
        <el-carousel height="300px" v-if="profile.departmentPhoto.length">
          <el-carousel-item v-for="(item, index) in profile.departmentPhoto">
            <el-image :src="item" fit="cover" style="width: 100%; height: 100%;" :preview-src-list="profile.departmentPhoto" :initial-index="index" preview-teleported />
          </el-carousel-item>
        </el-carousel>
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ profile.departmentPhone }}</el-descriptions-item>
      <el-descriptions-item label="简介">{{ profile.departmentDescription }}</el-descriptions-item>
    </el-descriptions>
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="荣誉列表" name="荣誉列表" lazy>
        <div v-if="profile.departmentHonorList.length" class="honor-list">
          <el-timeline class="honor-list-wrapper" v-if="!shouldUseVirtualList">
            <el-timeline-item v-for="(item, index) in profile.departmentHonorList" :key="index" :timestamp="item.issueDate" style="height: 180px;" placement="top">
              <el-card style="width: 70%;">
                <h2>{{ item.honorName }}</h2>
                <el-descriptions>
                  <el-descriptions-item label="荣誉者类别">{{ item.honorPersonType }}</el-descriptions-item>
                  <el-descriptions-item label="荣誉获得者">{{ item.honorPerson }}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div class="honor-list-container" v-bind="containerProps" style="height: 850px" v-else>
            <el-timeline class="honor-list-wrapper" v-bind="wrapperProps">
              <el-timeline-item v-for="{ data, index } in virtualList" :key="index" :timestamp="data.issueDate" style="height: 180px;" placement="top">
                <el-card style="width: 70%;">
                  <h2>{{ data.honorName }}</h2>
                  <el-descriptions>
                    <el-descriptions-item label="荣誉者类别">{{ data.honorPersonType }}</el-descriptions-item>
                    <el-descriptions-item label="荣誉获得者">{{ data.honorPerson }}</el-descriptions-item>
                  </el-descriptions>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <el-empty :image-size="240" v-else />
      </el-tab-pane>
      <el-tab-pane label="重大经历" name="重大经历" lazy>
        <Experience :id="id" @append="handleAppend" @modify="handleModify" @delete="handleDelete" is-department />
      </el-tab-pane>
      <el-tab-pane label="集体事迹" name="集体事迹" lazy>
        <Deed :id="id" is-department />
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
      <component ref="formCompRef" :is="formComponent" :id="formId" :data="formData" v-loading="isFormLoading" is-department></component>
      <template #footer>
        <el-button :icon="ElIconCheck" type="primary" @click="handleConfirm">确认</el-button>
        <el-button :icon="ElIconClose" @click="dialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
  <ToggleSetAwarded :id="id" v-model="profile.typicalLevel" is-department />
</template>

<script lang="ts" setup>
import { eventBusKey, eventBusContextKey } from '@/tokens';

import type { FormInstance } from 'element-plus';
import type { FormData } from './memberDetail.vue';

definePageMeta({
  middleware: 'auth'
});

const route = useRoute();
const id = parseInt(route.query.id as unknown as string);

const isFormLoading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('');

const { data: profile } = await useGetDepartmentProfile({ departmentId: id });
const shouldUseVirtualList = profile.value.departmentHonorList.length >= 100;
const { list: virtualList, containerProps, wrapperProps } = useVirtualList(ref(profile.value.departmentHonorList), { itemHeight: 200 });

const formId = ref(0);
const formComponent = shallowRef<Component>();
const formData = ref<FormData>();
const formCompRef = shallowRef();

const activeTab = computed(() => route.hash.slice(1) || '荣誉列表');

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
  dialogVisible.value = isFormLoading.value = true;
  setTimeout(() => isFormLoading.value = false, 300);
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