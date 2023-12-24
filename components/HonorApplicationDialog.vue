<template>
  <ClientOnly>
    <el-dialog title="荣誉申请详情" width="800" v-model="dialogVisible" align-center center>
      <el-steps style="padding: 0 50px;" :space="200" :active="1" align-center>
        <el-step title="提交申请" status="success" />
        <el-step 
          title='已处理'
          status="success"
        />
        <el-step 
          :title="
            status === '通过'
              ? '审核通过'
              : '申请被退回'
          "
          :status="
            status === '通过'
              ? 'success'
              : 'error'
          "
        />
      </el-steps>
      <el-descriptions :column="2" style="padding: 0 50px; margin-top: 20px" v-loading="isLoading" border>
        <el-descriptions-item label="荣誉名称">{{ data.honorName }}</el-descriptions-item>
        <el-descriptions-item label="荣誉者类别">{{ data.honorPersonType }}</el-descriptions-item>
        <el-descriptions-item label="荣誉获得者">{{ data.honorPerson }}</el-descriptions-item>
        <el-descriptions-item label="荣誉类别">{{ data.honorType }}</el-descriptions-item>
        <el-descriptions-item label="荣誉级别">{{ data.honorLevel }}</el-descriptions-item>
        <el-descriptions-item label="颁发日期">{{ data.issueDate }}</el-descriptions-item>
        <el-descriptions-item label="颁发单位">{{ data.issueUnit }}</el-descriptions-item>
        <el-descriptions-item label="发文号">{{ data.issueNumber }}</el-descriptions-item>
        <el-descriptions-item label="荣誉照片">
          <el-image style="width: 120px; height: 120px;" fit="cover" :src="data.honorPhoto" :preview-src-list="[data.honorPhoto]" v-if="data.honorPhoto" />
        </el-descriptions-item>
        <el-descriptions-item label="荣誉简介">{{ data.honorDesc }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { HonorDetail } from '@/composables/use-api-types';

const props = defineProps<{
  modelValue: boolean;
  id: number;
  status: '通过' | '退回';
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
}>();

const isLoading = ref(false);

const dialogVisible = computed({
  get: () => props.modelValue,
  set(val) {
    emit('update:modelValue', val);
    return val;
  }
});

const data = reactive<Omit<HonorDetail<string>, 'id'>>({
  honorDesc: '',
  honorLevel: '',
  honorName: '',
  honorPerson: '',
  honorPersonType: '',
  honorPhoto: '',
  honorType: '',
  issueDate: '',
  issueNumber: '',
  issueUnit: ''
});

watch(
  () => props.id,
  async val => {
    if(!val) return;

    isLoading.value = true;
    const { data: result } = await useGetApplicationDetail(
      { honorApplyId: val },
      {
        transform: resOption => {
          const { data, data: { honorPerson }} = resOption;
          data.honorPerson = (honorPerson as unknown as { label: number }).label;
          return data;
        }
      }
    );
    setFormValue(data, result);
    isLoading.value = false;
  }
);

</script>