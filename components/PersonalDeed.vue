<template>
  <div class="basic-table-title">
    <span class="basic-table-title__bar"></span>
    <h3 class="basic-table-title__content">个人事迹</h3>
    <div v-if="!isIndexPage && personalDeedsList.length">
      <el-button type="primary" :icon="ElIconPlus" @click="navigateTo(`/personalDeed?append=true&employeeId=${id}`)" text round v-if="!isIndexPage">新增</el-button>
    </div>
  </div>
  <el-card shadow="never" v-if="personalDeedsList.length">
    <div v-for="(item, index) in personalDeedsList">
      <PersonalDeedListItem :key="index" :item="item" @view="handleView" />
      <el-divider v-if="index < personalDeedsList.length - 1" />
    </div>
  </el-card>
  <el-empty :image-size="150" v-else>
    <el-button type="primary" :icon="ElIconPlus" @click="navigateTo(`/personalDeed?append=true&employeeId=${id}`)" v-if="!isIndexPage">新增</el-button>
  </el-empty>
  <ClientOnly>
    <el-dialog class="personal-deed-dialog" v-model="dialogVisible" :title="deedTitle" append-to-body align-center center>
      <div v-loading="isLoadingDeed" v-html="deedContent"></div>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>

const props = defineProps<{ id: number }>();
const { id } = props;

const dialogVisible = ref(false);
const deedTitle = ref('');
const deedContent = ref('');
const isLoadingDeed = ref(false);
const isIndexPage = useRoute().path.startsWith('/display');

const { data: personalDeedsList } = await useGetPersonalDeedsList({ employeeId: id });

const handleView = async (id: number) => {
  if(isIndexPage) {
    isLoadingDeed.value = true;
    dialogVisible.value = true;
    const { value: personalDeed } = (await useGetPersonalDeed({ id })).data;
    deedTitle.value = personalDeed.title;
    deedContent.value = personalDeed.content!;
    isLoadingDeed.value = false;
  } else await navigateTo(`/personalDeed?id=${id}`);
};
</script>

<style lang="scss">
  @use '@/assets/style/components/personal-deed' as *;
</style>