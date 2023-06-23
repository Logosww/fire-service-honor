<template>
  <el-container class="container">
    <el-header class="header">
      <Header />
    </el-header>
    <el-container class="main">
      <el-aside width="200px">
        <Sidebar />
      </el-aside>
      <el-main ref="mainContainerRef" style="padding-right: 0;">
        <el-scrollbar :max-height="height">
          <el-page-header @back="handleGoBack" title="返回">
            <template #breadcrumb v-if="!isIndex">
              <div class="breadcrumb">
                <el-breadcrumb :separator-icon="ElIconArrowRight">
                  <el-breadcrumb-item to="/admin">首页</el-breadcrumb-item>
                  <el-breadcrumb-item
                    v-for="(item, index) in breadcrumbs"
                    :key="index"
                    :to="item.to"
                    :replace="item.replace"
                  >
                    {{ item.title }}
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
            </template>
            <template #content>
              <span class="content-title">{{ breadcrumbs?.at(-1)?.title ?? '首页' }}</span>
            </template>
            <template #extra>
              <div id="is-awarded-wrapper"></div>
            </template>
          </el-page-header>
          <div class="page-content">
            <slot />
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
    <el-footer class="footer">
      <p>©2012-2023 杭州消防救援支队/技术支持：qikuo</p>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { breadcrumbMap } from '@/constants';
import { breadcrumbsKey, containerHeightKey } from '@/tokens';

const route = useRoute();
const router = useRouter();

const mainContainerRef = ref<HTMLElement>();

const isIndex = computed(() => route.path === '/admin');
const breadcrumbs = computed(() => breadcrumbMap[route.path]);

const { height } = useElementSize(mainContainerRef);

const handleGoBack = () => {
  router.back();
};

provide(breadcrumbsKey, breadcrumbs);
provide(containerHeightKey, height);
</script>

<style lang="scss">
@use '@/assets/style/layout' as *;
</style>