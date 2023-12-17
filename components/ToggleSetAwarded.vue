<template>
  <ClientOnly>
    <teleport to='#is-awarded-wrapper'>
      <el-text tag="span" style="user-select: none; margin-right: 10px;"><el-icon style="margin-right: 5px;">
          <ElIconTrophy />
        </el-icon>
        {{ isDepartment ? '设为大队先进集体' : '设为大队先进个人' }}
      </el-text>
      <el-switch
        style="margin-right: 30px;" 
        v-model="isAwarded"
        :loading="isSwitching"
        :before-change="handleIsAwardedChange" 
        :active-icon="ElIconCheck"
        @change="val => emit('update:modelValue', val ? 0 : -1)"
        inline-prompt
      />
    </teleport>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { TypicalLevel } from '@/composables/use-api-types';

const props = defineProps<{ id: number; modelValue?: TypicalLevel; isDepartment?: boolean }>();

const emit = defineEmits<{ 'update:modelValue': [val: TypicalLevel] }>();

const isSwitching = ref(false);
const isAwarded = ref((props.modelValue ?? -1) >= 0);

const handleIsAwardedChange = () => {
  const { id, isDepartment } = props;
  const alertMessage = isDepartment
    ? '此集体已被设为更高等级的先进集体，请在典型管理中进行降级和取消。'
    : '此人已被设为更高等级的先进个人，请在典型管理中进行降级和取消。';
  const cancelMessage = isDepartment
    ? '确定取消大队先进集体吗'
    : '确定取消大队先进个人吗？';
  const confirmMessage = isDepartment
    ? '确定将其设为大队先进集体吗?'
    : '确定将其设为大队先进个人吗?';

  isSwitching.value = true;
  if (isAwarded.value) {
    if (props.modelValue)
      return ElMessageBox.alert(alertMessage, '提示', { icon: markRaw(ElIconInfoFilled) })
        .then(() => false)
        .finally(() => isSwitching.value = false);
    else return ElMessageBox.confirm(cancelMessage, '提示', { icon: markRaw(ElIconInfoFilled) }).then(async () => {
      isDepartment
        ? (await useDemoteAwardedDepartmentLevel({ departmentId: id }))
        : (await useDemoteAwardedMemberLevel({ employeeId: id }));
      ElMessage({ type: 'success', message: '取消成功' });
      return true;
    }).finally(() => isSwitching.value = false);
  }
  else return ElMessageBox.confirm(confirmMessage, '提示', { icon: markRaw(ElIconInfoFilled) }).then(async () => {
    isDepartment
      ? (await useSetDepartmentAwarded({ departmentId: id }))
      : (await useSetMemberAwarded({ employeeId: id }));
    ElMessage({ type: 'success', message: '设置成功' });
    return true;
  }).finally(() => isSwitching.value = false);
};

</script>

<style></style>