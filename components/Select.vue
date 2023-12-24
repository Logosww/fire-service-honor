<template>
  <ClientOnly>
    <el-tree-select
      :modelValue="input"
      @change="handleInputChange"
      @clear="handleClear"
      :data="resolvedOptions"
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      :props="treeProps"
      :render-after-expand="false"
      :value-key="valueKey ?? 'label'"
      placeholder="请选择"
      check-on-click-node
      check-strictly
      clearable
      v-if="isTree || isOptionsAsTree"
    />
    <el-select 
      :modelValue="input"
      @change="handleInputChange"
      @clear="handleClear"
      placeholder="请选择" 
      :multiple="multiple"
      :filterable="filterable"
      :disabled="disabled"
      :value-key="valueKey ?? 'label'"
      allow-create
      clearable
      v-else
    >
      <el-option
        v-for="(item, index) in resolvedOptions"
        :key="valueKey ? item[valueKey] : index"
        :value="valueKey ? item : item['label']"
        :label="valueKey && item['label']"
        clearable
      />
    </el-select>
  
  </ClientOnly>
</template>

<script lang="ts" setup>

type Arrayable<T> = T | T[];
type IUnitModelValue = string | number;
type IModelValue = Arrayable<IUnitModelValue>;

const props = defineProps<{
  modelValue: IModelValue;
  selectTarget: string;
  options?: Record<string, any>[];
  isTree?: boolean;
  multiple?: boolean;
  filterable?: boolean;
  disabled?: boolean;
  valueKey?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: IModelValue): void;
}>();

const resolvedOptions = props.options ?? (await useGetSelectOptions(props.selectTarget)).data;
const isOptionsAsTree = unref(resolvedOptions).some(data => data?.children && data.children.length);

const treeProps = {
  value: props.valueKey || 'label',
  expandTrigger: 'hover'
};

const input = ref();

const handleInputChange = (val: IModelValue | Arrayable<Record<string, IUnitModelValue>>) => {
  if(!val || (Array.isArray(val) && val.some(value => !value))) return;

  val = typeof val === 'string' ? resolveDepartmentString(val) : val;
  input.value = val;

  const { valueKey } = props;
  valueKey && (val = 
    Array.isArray(val) 
      ? (val as Record<string, IUnitModelValue>[]).map(item => item[valueKey] ?? item) 
      : (val as Record<string, IModelValue>)[valueKey]
  );
  emit('update:modelValue', val as IModelValue);
};

const handleClear = () => {
  const val = props.multiple ? [] : '';
  input.value = val;
  emit('update:modelValue', val);
};

const resolveDepartmentString = (val: string) =>
  val.includes('/') ? val.split('/').at(-1)! : val;

const checkIfValueEmitted = (val: IModelValue) => {
  const { value } = input;
  const unitVal = Array.isArray(value) ? value[0] : value;
  if(!unitVal || typeof unitVal !== 'object') return false;

  const valueKey = props.valueKey ?? 'label';
  return val === unitVal[valueKey];
};

watchEffect(() => {
  const { modelValue } = props;
  if(typeof modelValue === 'undefined' || (modelValue && !checkIfValueEmitted(modelValue))) input.value = modelValue;
});

</script>