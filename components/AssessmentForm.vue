<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80">
    <el-form-item label="年度" prop="annual">
      <el-input v-model="form.annual" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="考评单位" prop="assessmentUnit">
      <el-input v-model="form.assessmentUnit" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="考评等级" prop="assessmentLevel">
      <Select v-model="form.assessmentLevel" select-target="考评等次类别" />
    </el-form-item>
    <el-form-item label="备注" prop="assessmentRemark">
      <el-input v-model="form.assessmentRemark" placeholder="请输入" type="textarea" :autosize="{ minRows: 3 }" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { eventBusContextKey } from '@/tokens';

import type { FormInstance, FormRules } from 'element-plus';
import type { AnnualAssessment } from '@/composables/use-api-types';

const props = defineProps<{ id: number, data?: AnnualAssessment }>();

const { id, data } = props;

const formRef = ref<FormInstance>();

const form = reactive<AnnualAssessment>(
  id ? { ...data! } : {
    id: 0,
    annual: '',
    assessmentUnit: '',
    assessmentLevel: '',
    assessmentRemark: ''
  }
);

const rules: FormRules = {
  annual: { required: true, trigger: 'blur', message: '请输入年度' },
  assessmentUnit: { required: true, trigger: 'blur', message: '请输入考评单位' },
  assessmentLevel: { required: true, trigger: 'blur', message: '请输入考评等级' },
};

const eventBus = inject(eventBusContextKey);

const unsubscribe = eventBus?.on(async ([e, employeeId]) => {
  if(e !== 'confirm') return;
  
  if(id) await useModifyAssessment(form);
  else await useAddAssessment({ employeeId: employeeId! as number, ...filterFormNull(form) });
  eventBus.emit(['submit', 'assessment']);
});

onUnmounted(() => unsubscribe!());

defineExpose({
  formRef
});
</script>