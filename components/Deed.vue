<template>
  <div class="basic-table-title">
    <span class="basic-table-title__bar"></span>
    <h3 class="basic-table-title__content">{{ isDepartment ? '集体事迹' : '个人事迹' }}</h3>
    <div v-if="!isIndexPage && deedsList.length">
      <el-button type="primary" :icon="ElIconPlus" @click="handleAddDeed" text round v-if="!isIndexPage">新增</el-button>
    </div>
  </div>
  <el-card shadow="never">
    <div v-if="deedsList.length">
      <div v-for="(item, index) in deedsList">
        <DeedListItem :key="index" :item="item" @view="handleView" />
        <el-divider v-if="index < deedsList.length - 1" />
      </div>
    </div>
    <el-empty :image-size="150" v-else>
      <el-button type="primary" :icon="ElIconPlus" @click="handleAddDeed" v-if="!isIndexPage">新增</el-button>
    </el-empty>
  </el-card>
  <ClientOnly>
    <el-dialog class="deed-dialog" v-model="dialogVisible" :title="deedTitle" append-to-body align-center center>
      <div v-loading="isLoadingDeed" v-html="deedContent"></div>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>

const props = defineProps<{ id: number, isDepartment?: boolean }>();
const { id, isDepartment } = props;

const dialogVisible = ref(false);
const deedTitle = ref('');
const deedContent = ref('');
const isLoadingDeed = ref(false);
const isIndexPage = useRoute().path.startsWith('/display');

const { data: deedsList } = isDepartment
  ? await useGetDepartmentDeedsList({ departmentId: id })
  : await useGetPersonalDeedsList({ employeeId: id });

const handleView = async (id: number) => {
  if(isIndexPage) {
    isLoadingDeed.value = true;
    dialogVisible.value = true;
    const { value: deed } = isDepartment ? ((await useGetDepartmentDeed({ id })).data) : ((await useGetPersonalDeed({ id })).data);
    deedTitle.value = deed.title;
    deedContent.value = deed.content!;
    isLoadingDeed.value = false;
  } else await navigateTo(`/deed?id=${id}&target=${isDepartment ? 'department' : 'person'}`);
};

const handleAddDeed = () => {
  const url = isDepartment ? `/deed?departmentId=${id}` : `/deed?employeeId=${id}`;
  return navigateTo(url);
};
</script>

<style lang="scss">
  @use '@/assets/style/components/deed' as *;
</style>