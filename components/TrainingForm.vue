<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80">
    <el-form-item label="开始日期" prop="startDate">
      <el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="结束日期" prop="endDate">
      <el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" :disabled="form.endDate === '至今'" />
      <el-checkbox v-model="form.endDate" true-label="至今">至今</el-checkbox>
    </el-form-item>
    <el-form-item label="培训类别" prop="trainType">
      <Select v-model="form.trainType" select-target="培训学习类别" />
    </el-form-item>
    <el-form-item label="培训机构" prop="trainUnit">
      <el-input v-model="form.trainUnit" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="培训结果" prop="trainResult">
      <Select v-model="form.trainResult" select-target="培训结果类别" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { eventBusContextKey } from '@/tokens';

import type { FormInstance, FormRules } from 'element-plus';
import type { Training } from '@/composables/use-api-types';

const props = defineProps<{ id: number, data?: Training }>();

const { id, data } = props;

const formRef = ref<FormInstance>();

const form = reactive<Training>(
  id ? { ...data! } : {
    id: 0,
    startDate: '',
    endDate: '',
    trainType: '',
    trainUnit: '',
    trainResult: ''
  }
);

const rules: FormRules = {
  startDate: { required: true, trigger: 'blur', message: '请选择开始日期' },
  endDate: { required: true, trigger: 'blur', message: '请选择结束日期' },
  trainType: { required: true, trigger: 'blur', message: '请选择培训类别' },
  trainUnit: { required: true, trigger: 'blur', message: '请输入培训机构' },
  trainResult: { required: true, trigger: 'blur', message: '请选择培训结果' },
};

const eventBus = inject(eventBusContextKey);

const unsubscribe = eventBus?.on(async ([e, employeeId]) => {
  if(e !== 'confirm') return;
  
  if(id) await useModifyTraining(form);
  else await useAddTraining({ employeeId: employeeId! as number, ...filterFormNull(form) });
  eventBus.emit(['submit', 'training']);
});

onUnmounted(() => unsubscribe!());

defineExpose({
  formRef
});
</script>