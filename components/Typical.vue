<template>
  <BasicTable
    :tableColumnProps="columnProps"
    :data="data"
    title="典型路线"
    @modify="data => emit('modify', typicalForm, data, '典型路线')"
    @delete="id => emit('delete', 'typical', id, '典型路线')"
    @append="emit('append', typicalForm, '典型路线')"
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
  delete: [form: string, id: number, name: string];
  append: [formComponent: Component, name: string];
  modify: [formComponent: Component, data: FormData, name: string];
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