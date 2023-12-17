<template>
  <BasicTable 
    :tableColumnProps="eventColumnProps"
    :data="eventData"
    title="重大事件"
    @modify="data => emit('modify', eventForm, data, '重大事件')"
    @delete="id => emit('delete', 'event', id, '重大事件')"
    @append="emit('append', eventForm, '重大事件')"
  />
  <BasicTable 
    :tableColumnProps="contestColumnProps"
    :data="contestData"
    title="比武竞赛"
    @modify="data => emit('modify', contestForm, data, '比武竞赛')"
    @delete="id => emit('delete', 'contest', id, '比武竞赛')"
    @append="emit('append', contestForm, '比武竞赛')"
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
  isDepartment?: boolean;
}>();

const emit = defineEmits<{
  delete: [form: string, id: number, name: string];
  append: [formComponent: Component, name: string];
  modify: [formComponent: Component, data: FormData, name: string];
}>();

const { id, isDepartment } = props;

const eventColumnProps = tableColumnPropsMap['event'];
const contestColumnProps = tableColumnPropsMap['contest'];

const { data: eventData, refresh: refreshEvents } = isDepartment
  ? (await useGetDepartmentEvents({ departmentId: id }))
  : (await useGetEvents({ employeeId: id }));
const { data: contestData, refresh: refrehContests } = isDepartment
  ? (await useGetDepartmentContests({ departmentId: id }))
  : (await useGetContests({ employeeId: id }));

const eventBus = inject(eventBusContextKey);
eventBus?.on(async ([e, form, id]) => {
  if(e === 'confirm') return;

  if(e === 'submit') {
    if(form === 'event') await refreshEvents();
    else if(form === 'contest') await refrehContests();
  } else {
    if(form === 'event') {
      isDepartment ? (await useDeleteDepartmentEvent({ id: id! })) : (await useDeleteEvent({ id: id! }));
      await refreshEvents();
      ElMessage({ type: 'success', message: '删除成功' });
    } else if(form === 'contest') {
      isDepartment ? (await useDeleteDepartmentContest({ id: id! })) : (await useDeleteContest({ id: id! }));
      await refrehContests();
      ElMessage({ type: 'success', message: '删除成功' });
    }
  }
});

</script>