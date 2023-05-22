<template>
  <el-tree
    ref="treeRef"
    :props="{ class: () => 'my-tree-node' }"
    :data="data"
    node-key="id"
    @node-click="menuVisible = false"
    highlight-current
   >
    <template #default="{ data }">
      <TreeNode :data="data" @append="handleAppend" @open-menu="handleMenuOpen" @modified="handleModified" />
    </template>
    <template #empty>
      <el-empty :image-size="240" v-show="!isEmptyAdding">
        <el-button type="primary" @click="handleEmptyAdd">添加字典</el-button>
      </el-empty>
      <TreeNode ref="emptyNodeRef" :data="{ parentId: 0, id: 1, label: '' }" v-show="isEmptyAdding" @open-menu="handleMenuOpen" @modified="handleModified" />
    </template>
  </el-tree>
  <ClientOnly>
    <el-popover
      :visible="menuVisible"
      popper-class="tree-menu"
      placement="bottom-start"
      transition="slide-up"
      :width="180"
      :hide-after="0"
      :virtual-ref="menuTriggerRef"
      :show-arrow="false"
      @hide="menuTriggerRef = undefined"
      virtual-triggering
    >
      <ul class="tree-menu-wrapper">
        <li class="tree-menu-item" @click="handleAppendUnder"><el-icon><ElIconFolderAdd /></el-icon>新增子级</li>
        <li class="tree-menu-item" @click="handleRemove" v-if="showDelete"><el-icon><ElIconDelete /></el-icon>删除</li>
      </ul>
    </el-popover>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus';
import TreeNode from '@/components/TreeNode.vue';

import 'element-plus/theme-chalk/el-tree.css';

import type { TreeNodeData } from '@/composables/use-api-types';

definePageMeta({
  middleware: ['auth', 'admin']
});

const targetNodeId = ref(0);
const menuVisible = ref(false);
const isEmptyAdding = ref(false);
const showDelete = ref(false);
const { data } = await useGetDictionaries();

const menuTriggerRef = ref();
const treeRef = ref<InstanceType<typeof ElTree>>();
const emptyNodeRef = ref<InstanceType<typeof TreeNode>>();

onClickOutside(treeRef as any, () => menuVisible.value = false);

const handleEmptyAdd = () => {
  isEmptyAdding.value = true;
  emptyNodeRef.value?.modify();
};

const handleAppend = async (
  option: {
    parentId: number;
    isLeaf: boolean;
  }
) => {
  const { parentId, isLeaf } = option;
  const parentNode = parentId
    ? treeRef.value?.getNode(parentId)
    : treeRef.value?.store.root;
  if(!parentNode) return;
  const prevNode = Array.isArray(parentNode) 
    ? parentNode.at(-1) 
    : parentNode.childNodes.at(-1);
  
  const id = await useAddDictionary({ parentId, dictName: '' });
  const childId = (!isLeaf) && (await useAddDictionary({ parentId: id, dictName: '' }));
  
  const node: TreeNodeData = {
    id,
    parentId,
    label: '',
    focusOnSpawn: true,
    children: isLeaf
      ? undefined 
      : [{ id: childId as number, parentId: id, label: '' }] 
  };

  treeRef.value?.insertAfter(
    node,
    prevNode
  );
};

const handleRemove = () => {
  menuVisible.value = false;
  ConfirmDelete('字典', async () => {
    const id = targetNodeId.value;
    await useDeleteDictionary({ dictId: id });
    const node = treeRef.value?.getNode(id)!;
    treeRef.value?.remove(node);
    ElMessage({ type: 'success', message: '删除成功' });
  });
};

const handleAppendUnder = async () => {
  menuVisible.value = false;
  const parentId = targetNodeId.value;
  const parentNode = treeRef.value?.getNode(parentId)!;

  const id = await useAddDictionary({ parentId, dictName: '' });
  const childId = await useAddDictionary({ parentId: id, dictName: '' });

  const node: TreeNodeData = {
    id,
    parentId: targetNodeId.value,
    label: '',
    focusOnSpawn: true,
    children: [{ id: childId, parentId: id, label: '' }]
  };
  treeRef.value?.append(node, parentNode);
  treeRef.value?.setCurrentKey(id);
};

const handleModified = async (option: { 
  value: string,
  id: number
}) => {
  const { value, id } = option;
  await useModifyDictionary({ dictId: id, dictNewName: value });
};

const handleMenuOpen = (option: { ref: any, id: number, parentId: number }) => {
  const { ref, id, parentId } = option;
  targetNodeId.value = id;
  showDelete.value = !!parentId;
  menuTriggerRef.value = ref;
  setTimeout(() => menuVisible.value = true);
};

</script>

<style lang="scss">
  @use '@/assets/style/dictionary' as *;
</style>