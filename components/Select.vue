<template>
  <ClientOnly>
    <el-select 
      :modelValue="input"
      @update:modelValue="handleInputChange"
      @clear="handleClear"
      placeholder="请选择" 
      :multiple="multiple"
      :filterable="filterable"
      allow-create
      clearable
      v-if="!isTree"
    >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :value="item.label"
        clearable
      />
    </el-select>
    <el-tree-select
      :modelValue="input"
      @update:modelValue="handleInputChange"
      @clear="handleClear"
      :data="options"
      :multiple="multiple"
      :filterable="filterable"
      :props="treeProps"
      :render-after-expand="false"
      placeholder="请选择"
      check-on-click-node
      check-strictly
      v-else
    />
  </ClientOnly>
</template>

<script lang="ts" setup>

const props = defineProps<{
  modelValue: string | string[];
  selectTarget: string;
  isTree?: boolean;
  multiple?: boolean;
  filterable?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: string | string[]): void;
}>();

const { data: options } = await useGetSelectOptions(props.selectTarget);

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
  const val = resolveDepartmentString(modelValue as string);
  input.value = val;
});

</script>