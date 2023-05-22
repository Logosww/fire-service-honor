<template>
  <ClientOnly>
    <el-dialog title="荣誉申请详情" width="800" v-model="dialogVisible" align-center center>
      <el-steps style="padding: 0 50px;" :space="200" :active="1" align-center>
        <el-step title="提交申请" status="success" />
        <el-step 
          :title="status === '待处理' ? '待审核' : '已审核'"
          :status="status === '待处理' ? 'process' : 'success'"
        />
        <el-step 
          :title="
            status === '待处理'
              ? '结果'
              : status === '通过'
                ? '审核通过'
                : '审核未通过'
          "
          :status="
            status === '待处理'
              ? 'wait'
              : status === '通过'
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
      <template #footer>
        <el-button :icon="ElIconSelect" type="primary" @click="handleDealt('通过')" v-if="!isResolved">通过</el-button>
        <el-button :icon="ElIconCloseBold" type="danger" @click="handleDealt('退回')" v-if="!isResolved">退回</el-button>
        <el-button type="primary" @click="dialogVisible = false" v-else>关闭窗口</el-button>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { HonorDetail } from '@/composables/use-api-types';

const props = defineProps<{
  modelValue: boolean;
  id: number;
  status: '待处理' | '通过' | '退回';
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', val: boolean): void;
  (event: 'update:status', val: '待处理' | '通过' | '退回'): void;
}>();

const isLoading = ref(false);

const isResolved = computed(() => props.status !== '待处理');
const dialogVisible = computed({
  get: () => props.modelValue,
  set(val) {
    emit('update:modelValue', val);
    return val;
  }
});

const data = reactive<Omit<HonorDetail, 'id'>>({
  honorDesc: '',
  honorLevel: '',
  honorName: '',
  honorPerson: '',
  honorPersonType: '',
  honorPhoto: '',
  honorType: '',
  honorDepartment: '',
  issueDate: '',
  issueNumber: '',
  issueUnit: ''
});

const handleDealt = async (auditStatus: '待处理' | '通过' | '退回') => {
  const { id } = props;
  await useDealApplication({ id, auditStatus });
  emit('update:status', auditStatus);
};

watch(
  () => props.id,
  async val => {
    if(!val) return;

    isLoading.value = true;
    const { data: result } = await useGetApplicationDetail({ honorApplyId: val });
    setFormValue(data, result);
    isLoading.value = false;
  }
);

</script>