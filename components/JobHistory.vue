<template>
  <BasicTable 
    :tableColumnProps="jobColumnProps"
    :data="jobData"
    title="工作经历"
    @modify="data => emit('modify', JobForm, data)"
    @delete="id => emit('delete', 'job', id)"
    @append="emit('append', JobForm)"
  />
  <BasicTable 
    :tableColumnProps="assessmentColumnProps"
    :data="assessmentData"
    title="年度考核"
    @modify="data => emit('modify', AssessmentForm, data)"
    @delete="id => emit('delete', 'assessment', id)"
    @append="emit('append', AssessmentForm)"
  />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';
import { eventBusContextKey } from '@/tokens';

import JobForm from './JobForm.vue';
import AssessmentForm from './AssessmentForm.vue';

import type { FormData } from '@/pages/memberDetail.vue';

const props = defineProps<{
  id: number;
}>();

const emit = defineEmits<{
  delete: [form: string, id: number];
  append: [formComponent: Component];
  modify: [formComponent: Component, data: FormData];
}>();

const { id } = props;

const jobColumnProps = tableColumnPropsMap['jobHistory'];
const assessmentColumnProps = tableColumnPropsMap['annualAssessment'];

const { data: jobData, refresh: refreshJob } = await useGetJobHistory({ employeeId: id });
const { data: assessmentData, refresh: refreshAsssessment } = await useGetAssessments({ employeeId: id });

const eventBus = inject(eventBusContextKey);
eventBus?.on(async ([e, form, id]) => {
  if(e === 'confirm') return;

  if(e === 'submit') {
    if(form === 'job') await refreshJob();
    else if(form === 'assessment') await refreshAsssessment();
  } else {
    if(form === 'job') {
      await useDeleteJobHistory({ id: id! });
      await refreshJob();
      ElMessage({ type: 'success', message: '删除成功' });
    } else if(form === 'assessment') {
      await useDeleteAssessment({ id: id! });
      await refreshAsssessment();
      ElMessage({ type: 'success', message: '删除成功' });
    }
  }
});

</script>