<template>
  <ClientOnly>
    <el-menu
      active-text-color="#5eaeff"
      :background-color="isDark ? '#262727' : '#495c6e'"
      text-color="#fff"
      :default-openeds="['1', '2', '3']"
      :default-active="activeMenu"
      router
    >
      <el-sub-menu index="1">
        <template #title>
          <el-icon><ElIconUser /></el-icon>
          <span>相关人员</span>
        </template>
        <el-menu-item index="/member">人员管理</el-menu-item>
        <el-menu-item index="/department">集体管理</el-menu-item>
        <el-menu-item index="/typicalCharactor">典型人物管理</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <el-icon><ElIconMedal /></el-icon>
          <span>荣誉事迹</span>
        </template>
        <el-menu-item index="/honor">荣誉管理</el-menu-item>
        <el-menu-item index="/honorProject" v-if="isAdmin">荣誉项目管理</el-menu-item>
        <el-menu-item index="/honorAudit" v-if="isAdmin">荣誉审核</el-menu-item>
        <el-menu-item index="/honorApply" v-else>荣誉申请</el-menu-item>
        <el-menu-item index="/honorStatistics" v-if="isAdmin">荣誉统计</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/serviceChange" v-if="isAdmin">
        <el-icon><ElIconSwitch /></el-icon>
        <span>关系变动</span>
      </el-menu-item>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><ElIconSetting /></el-icon>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/log">日志管理</el-menu-item>
        <el-menu-item index="/administrator" v-if="isAdmin">管理员管理</el-menu-item>
        <el-menu-item index="/dictionary" v-if="isAdmin">字典管理</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { breadcrumbsKey, isDarkInjectionKey } from '@/tokens';

const breadcumbs = inject(breadcrumbsKey);
const activeMenu = breadcumbs?.value?.length
  ? breadcumbs?.value[0].to
  : undefined;

const isAdmin = useAdmin();
const isDark = inject(isDarkInjectionKey);
</script>