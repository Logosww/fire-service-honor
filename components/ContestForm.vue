<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80">
    <el-form-item label="竞赛日期" prop="competitionDate">
      <el-date-picker v-model="form.competitionDate" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="竞赛类别" prop="competitionType">
      <Select v-model="form.competitionType" select-target="竞赛/比武类别" />
    </el-form-item>
    <el-form-item label="竞赛名称" prop="competitionName">
      <el-input v-model="form.competitionName" placeholder="请输入" />
    </el-form-item>
    <el-form-item label="竞赛奖项" prop="competitionAward">
      <el-input v-model="form.competitionAward" placeholder="请输入" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { eventBusContextKey } from '@/tokens';

import type { FormInstance, FormRules } from 'element-plus';
import type { Contest } from '@/composables/use-api-types';

const props = defineProps<{ id: number, data?: Contest }>();

const { id, data } = props;

const formRef = ref<FormInstance>();

const form = reactive<Contest>(
  id ? { ...data! } : {
    id: 0,
    competitionName: '',
    competitionDate: '',
    competitionType: '',
    competitionAward: ''
  }
);

const rules: FormRules = {
  competitionName: { required: true, trigger: 'blur', message: '请输入竞赛名称' },
  competitionDate: { required: true, trigger: 'blur', message: '请选择竞赛日期' },
  competitionType: { required: true, trigger: 'blur', message: '请选择竞赛类别' }
};

const eventBus = inject(eventBusContextKey);

const unsubscribe = eventBus?.on(async ([e, employeeId]) => {
  if(e !== 'confirm') return;
  
  if(id) await useModifyContest(form);
  else await useAddContest({ employeeId: employeeId! as number, ...filterFormNull(form) });
  eventBus.emit(['submit', 'contest']);
});

onUnmounted(() => unsubscribe!());

defineExpose({
  formRef
});
</script>