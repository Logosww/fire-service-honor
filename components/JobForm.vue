<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120">
    <el-form-item label="开始日期" prop="startDate">
      <el-date-picker v-model="form.startDate" type="month" value-format="YYYY-MM" />
    </el-form-item>
    <el-form-item label="结束日期" prop="endDate">
      <el-date-picker v-model="form.endDate" type="month" value-format="YYYY-MM" :disabled="form.endDate === '至今'" />
      <el-switch style="margin-left: 16px;" v-model="form.endDate" active-text="至今" active-value="至今" />
    </el-form-item>
    <el-form-item label="工作单位" prop="unit">
      <el-input v-model="form.unit" style="width: 220px;" placeholder="请输入" clearable />
    </el-form-item>
    <el-form-item label="职务" prop="position">
      <el-input v-model="form.position" style="width: 220px;" placeholder="请输入" clearable />
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
  endDate: {
    trigger: 'change',
    validator: (_, value, callback) => {
      if(!value) return callback(new Error('请选择结束日期'));
      return callback(value === '至今' || isDateAfter(value, form.startDate) ? void 0 : new Error('结束日期不能早于开始日期'));
    },
  },
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