<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120">
    <el-form-item label="开始日期" prop="startDate">
      <el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="结束日期" prop="endDate">
      <el-date-picker v-model="form.endDate" value-format="YYYY-MM-DD" :disabled="form.endDate === '至今'" />
      <el-checkbox v-model="form.endDate" true-label="至今">至今</el-checkbox>
    </el-form-item>
    <el-form-item label="工作单位" prop="unit">
      <Select v-model="form.unit" select-target="DepartmentTree" is-tree filterable />
    </el-form-item>
    <el-form-item label="职务" prop="position">
      <el-input v-model="form.position" placeholder="请输入" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { eventBusContextKey } from '@/tokens';

import type { FormInstance, FormRules } from 'element-plus';
import type { JobHitory } from '@/composables/use-api-types';

const props = defineProps<{ id: number, data?: JobHitory }>();

const { id, data } = props;

const formRef = ref<FormInstance>();

const form = reactive<JobHitory>(
  id ? { ...data! } : {
    id: 0,
    startDate: '',
    endDate: '',
    unit: '',
    position: ''
  }
);

const rules: FormRules = {
  startDate: { required: true, trigger: 'blur', message: '请选择开始日期' },
  endDate: { required: true, trigger: 'blur', message: '请选择结束日期' },
  unit: { required: true, trigger: 'blur', message: '请选择工作单位' },
  position: { required: true, trigger: 'blur', message: '请输入职务' },
};

const eventBus = inject(eventBusContextKey);

const unsubscribe = eventBus?.on(async ([e, employeeId]) => {
  if(e !== 'confirm') return;

  if(id) await useModifyJobHistory(form);
  else await useAddJobHistory({ employeeId: employeeId! as number, ...filterFormNull(form) });
  eventBus.emit(['submit', 'job']);
});

onUnmounted(() => unsubscribe!());

defineExpose({
  formRef
});
</script>