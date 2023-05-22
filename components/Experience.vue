<template>
  <BasicTable 
    :tableColumnProps="eventColumnProps"
    :data="eventData"
    title="重大事件"
    @modify="data => emit('modify', eventForm, data)"
    @delete="id => emit('delete', 'event', id)"
    @append="emit('append', eventForm)"
  />
  <BasicTable 
    :tableColumnProps="contestColumnProps"
    :data="contestData"
    title="比武竞赛"
    @modify="data => emit('modify', contestForm, data)"
    @delete="id => emit('delete', 'contest', id)"
    @append="emit('append', contestForm)"
  />
</template>

<script lang="ts" setup>
import { tableColumnPropsMap } from '@/constants';
import { eventBusContextKey } from '@/tokens';

import eventForm from './EventForm.vue';
import contestForm from './ContestForm.vue';

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

const eventColumnProps = tableColumnPropsMap['event'];
const contestColumnProps = tableColumnPropsMap['contest'];

const { data: eventData, refresh: refreshEvents } = await useGetEvents({ employeeId: id });
const { data: contestData, refresh: refrehContests } = await useGetContests({ employeeId: id });

const eventBus = inject(eventBusContextKey);
eventBus?.on(async ([e, form, id]) => {
  if(e === 'confirm') return;

  if(e === 'submit') {
    if(form === 'event') await refreshEvents();
    else if(form === 'contest') await refrehContests();
  } else {
    if(form === 'event') {
      await useDeleteEvent({ id: id! });
      await refreshEvents();
      ElMessage({ type: 'success', message: '删除成功' });
    } else if(form === 'contest') {
      await useDeleteContest({ id: id! });
      await refrehContests();
      ElMessage({ type: 'success', message: '删除成功' });
    }
  }
});

</script>