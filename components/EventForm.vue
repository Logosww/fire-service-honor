<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80">
    <el-form-item label="事件日期" prop="eventTime">
      <el-date-picker v-model="form.eventTime" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="事件类别" prop="eventType">
      <Select v-model="form.eventType" select-target="重大事件类别" />
    </el-form-item>
    <el-form-item label="事件内容" prop="eventContent">
      <el-input v-model="form.eventContent" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="事件描述" prop="eventDescription">
      <el-input v-model="form.eventDescription" placeholder="请输入" type="textarea" :autosize="{ minRows: 3 }" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { eventBusContextKey } from '@/tokens';

import type { FormInstance, FormRules } from 'element-plus';
import type { Event } from '@/composables/use-api-types';

const props = defineProps<{ id: number, data?: Event }>();

const { id, data } = props;

const formRef = ref<FormInstance>();

const form = reactive<Event>(
  id ? { ...data! } : {
    id: 0,
    eventTime: '',
    eventContent: '',
    eventType: '',
    eventDescription: ''
  }
);

const rules: FormRules = {
  eventTime: { required: true, trigger: 'blur', message: '请选择事件日期' },
  eventContent: { required: true, trigger: 'blur', message: '请输入事件内容' },
  eventType: { required: true, trigger: 'blur', message: '请选择事件类别' },
};

const eventBus = inject(eventBusContextKey);

const unsubscribe = eventBus?.on(async ([e, employeeId]) => {
  if(e !== 'confirm') return;
  
  if(id) await useModifyEvent(form);
  else await useAddEvent({ employeeId: employeeId! as number, ...filterFormNull(form) });
  eventBus.emit(['submit', 'event']);
});

onUnmounted(() => unsubscribe!());

defineExpose({
  formRef
});
</script>