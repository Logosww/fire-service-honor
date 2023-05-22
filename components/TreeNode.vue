<template>
  <div class="tree-node-wrapper" ref="treeNodeRef" @click.right.prevent="handleRightClickMenu">
    <div class="tree-node">
      <div class="tree-node__content" v-if="data.parentId">
        <span 
        v-show="!isModifying" 
        @click.stop="handleModify"
        >
          {{ input }}
        </span>
        <el-input 
          ref="inputRef"
          :placeholder="placeholder"
          v-model="input"
          v-show="isModifying"
          @blur="handleModified"
        />
      </div>
      <div class="tree-node__content" v-else>{{  input }}</div>
      <div class="tree-node__operation" v-if="data.parentId">
        <el-button 
          type="primary"
          style="font-size: 16px;"
          :icon="ElIconPlus"
          @click.stop="handleAppend"
          link
        />
        <el-button
          ref="moreBtnRef"
          :icon="ElIconMoreFilled"
          style="font-size: 16px;"
          @click.stop="emit('open-menu', { ref: moreBtnRef, id: data.id, parentId: data.parentId })"
          link
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElInput } from 'element-plus';

import type { TreeNodeData } from '@/composables/use-api-types';

const props = defineProps<{
  data: TreeNodeData;
}>();

const emit = defineEmits<{
  (event: 'modified', option: { value: string, id: number; }): void;
  (event: 'append', option: { parentId: number; isLeaf: boolean }): void;
  (event: 'open-menu', option: { ref: any; id: number, parentId: number }): void;
}>();

const { data } = props;
const placeholder = data.children ? '字典名称' : '字典值';

const input = ref(data.label);
const isModifying = ref(false);

const moreBtnRef = ref();
const treeNodeRef = ref();
const inputRef = ref<InstanceType<typeof ElInput>>();

const handleModify = () => {
  isModifying.value = true;
  inputRef.value?.focus();
};

const handleModified = () => {
  isModifying.value = false;
  emit('modified', { value: input.value, id: data.id });
};

const handleAppend = () => 
  emit('append', { 
    parentId: data.parentId, 
    isLeaf: !data.children?.length 
  });

const handleRightClickMenu = (e: MouseEvent) => {
  const eleRef = {
    getBoundingClientRect: () => DOMRect.fromRect({
      width: 0,
      height: 0,
      x: e.clientX,
      y: e.clientY
    })
  };
  const { id, parentId } = data;
  emit('open-menu', { ref: eleRef, id, parentId });
};

defineExpose({
  modify: handleModify
});

onMounted(() => {
  if(data.focusOnSpawn) {
    isModifying.value = true;
    inputRef.value?.focus();
  }
});

</script>

<style lang="scss">
  @use '@/assets/style/components/tree-node' as *;
</style>