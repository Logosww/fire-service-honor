<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120">
    <el-form-item label="典型确定日期" prop="typicalDate">
      <el-date-picker v-model="form.typicalDate" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="典型类别" prop="typicalType">
      <Select v-model="form.typicalType" select-target="典型路线类别" />
    </el-form-item>
    <el-form-item label="典型单位" prop="typicalUnit">
      <el-input v-model="form.typicalUnit" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="典型描述" prop="typeDescription">
      <el-input v-model="form.typeDescription" placeholder="请输入" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { eventBusContextKey } from '@/tokens';

import type { FormInstance, FormRules } from 'element-plus';
import type { Typical } from '@/composables/use-api-types';

const props = defineProps<{ id: number, data?: Typical }>();

const { id, data } = props;

const formRef = ref<FormInstance>();

const form = reactive<Typical>(
  id ? { ...data! } : {
    id: 0,
    typicalDate: '',
    typicalType: '',
    typicalUnit: '',
    typeDescription: ''
  }
);

const rules: FormRules = {
  typicalDate: { required: true, trigger: 'blur', message: '请选择典型确定日期' },
  typicalType: { required: true, trigger: 'blur', message: '请选择典型类别' },
  typicalUnit: { required: true, trigger: 'blur', message: '请输入典型单位' },
};

const eventBus = inject(eventBusContextKey);

const unsubscribe = eventBus?.on(async ([e, employeeId]) => {
  if(e !== 'confirm') return;
  if(id) await useModifyTypical(form);
  else await useAddTypical({ employeeId: employeeId! as number, ...filterFormNull(form) });
  eventBus.emit(['submit', 'typical']);
});

onUnmounted(() => unsubscribe!());

defineExpose({
  formRef
});
</script>