<template>
  <ClientOnly>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="doQuery"
      :trigger-on-focus="false"
      placeholder="请输入"
      clearable
      @select="item => input = item.value"
      @change="val => emit('update:modelValue', val)"
    />
  </ClientOnly>
</template>

<script lang="ts" setup>

import type { AutoCompleteQueryTarget } from '@/composables/use-api-types';

const props = defineProps<{
  modelValue: string;
  queryTarget: AutoCompleteQueryTarget;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>();

const input = computed({
  get() {
    return props.modelValue;
  },
  set(val: string) {
    emit('update:modelValue', val);
    return val;
  }
});

const queryUrl = `/querySuggestions/queryList${props.queryTarget}`;
const key = `like${props.queryTarget}`;
const params: Record<string, string> = {};

const doQuery = (query: string, cb: any) => {
  params[key] = query;
  useGetAutoCompleteItems(queryUrl, params).then(res => {
    const result = res.map(item => ({ value: item }));
    cb(result);
  });
};

</script>