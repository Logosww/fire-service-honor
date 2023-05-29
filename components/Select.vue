<template>
  <ClientOnly>
    <el-select 
      :modelValue="input"
      @update:modelValue="handleInputChange"
      @clear="handleClear"
      placeholder="请选择" 
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      allow-create
      clearable
      v-if="!isTree"
    >
      <el-option
        v-for="(item, index) in resolvedOptions"
        :key="index"
        :value="(item as any).label ?? item"
        clearable
      />
    </el-select>
    <el-tree-select
      :modelValue="input"
      @update:modelValue="handleInputChange"
      @clear="handleClear"
      :data="resolvedOptions"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      :props="treeProps"
      :render-after-expand="false"
      placeholder="请选择"
      check-on-click-node
      check-strictly
      clearable
      v-else
    />
  </ClientOnly>
</template>

<script lang="ts" setup>

const props = defineProps<{
  modelValue: string | string[];
  selectTarget: string;
  options?: any[];
  isTree?: boolean;
  multiple?: boolean;
  filterable?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: string | string[]): void;
}>();

const resolvedOptions = props.options ?? (await useGetSelectOptions(props.selectTarget)).data;

const treeProps = {
  value: 'label',
  expandTrigger: 'hover'
};

const input = ref();

const handleInputChange = (val: string | string[]) => {
  if(!val || (Array.isArray(val) && val.some(value => !value))) return;
  input.value = val;
  emit('update:modelValue', val);
};

const handleClear = () => {
  const val = props.multiple ? [] : '';
  input.value = val;
  emit('update:modelValue', val);
};

const resolveDepartmentString = (val: string) =>
  val.includes('/') ? val.split('/').at(-1)! : val;

watchEffect(() => {
  const { modelValue } = props;
  const val = modelValue && resolveDepartmentString(modelValue as string);
  input.value = val;
});

</script>