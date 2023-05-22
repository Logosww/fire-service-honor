<template>
  <BasicTable 
    :tableColumnProps="columnProps"
    :data="data"
    title="能力跃升"
    @modify="data => emit('modify', trainingForm, data)"
    @delete="id => emit('delete', 'training', id)"
    @append="emit('append', trainingForm)"
  />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';
import { eventBusContextKey } from '@/tokens';

import trainingForm from './TrainingForm.vue';

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

const columnProps = tableColumnPropsMap['training'];

const { data, refresh } = await useGetTraining({ employeeId: id });

const eventBus = inject(eventBusContextKey);
eventBus?.on(async ([e, form, id]) => {
  if(e === 'confirm') return;

  if(e === 'submit') {
    form === 'training' && (await refresh());
  } else {
    if(form === 'training') {
      await useDeleteTraining({ id: id! });
      await refresh();
      ElMessage({ type: 'success', message: '删除成功' });
    }
  }
});

</script>