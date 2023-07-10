<template>
  <BasicTable
    :tableColumnProps="columnProps"
    :data="data"
    title="典型路线"
    @modify="data => emit('modify', typicalForm, data)"
    @delete="id => emit('delete', 'typical', id)"
    @append="emit('append', typicalForm)"
  />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';
import { eventBusContextKey } from '@/tokens';

import typicalForm from './TypicalForm.vue';

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

const columnProps = tableColumnPropsMap['typical'];

const { data, refresh } = await useGetTypical({ employeeId: id });

const eventBus = inject(eventBusContextKey);
eventBus?.on(async ([e, form, id]) => {
  if(e === 'confirm') return;

  if(e === 'submit') {
    form === 'typical' && (await refresh());
  } else {
    if(form === 'typical') {
      await useDeleteTypical({ id: id! });
      await refresh();
      ElMessage({ type: 'success', message: '删除成功' });
    }
  }
});

</script>