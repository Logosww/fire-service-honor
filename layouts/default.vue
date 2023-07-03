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
      <p>© 2012-2023 杭州消防救援支队/技术支持：qikuo</p>
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import { breadcrumbMap } from '@/constants';
import { breadcrumbsKey, containerHeightKey } from '@/tokens';

import { ElButton } from 'element-plus';

const route = useRoute();
const router = useRouter();

const mainContainerRef = ref<HTMLElement>();

const isIndex = computed(() => route.path === '/admin');
const breadcrumbs = computed(() => breadcrumbMap[route.path]);

const { height } = useElementSize(mainContainerRef);

let es: EventSource;

const handleGoBack = () => {
  router.back();
};

provide(breadcrumbsKey, breadcrumbs);
provide(containerHeightKey, height);

onMounted(() => {
  if(!useAdmin().value) {
    const proceedMessage = (message: string) => {
      console.log(message);
      const notification = ElNotification.info({
        title: '消息',
        message: h('div', [
          h('span', message),
          h(ElButton, { 
            type: 'primary',
            text: true,
            round: true,
            style: 'float: right; margin-top: 10px;',
            onClick: () => {
              notification.close();
              return navigateTo('/honorApply');
            }
          }, () => '查看详情')
        ])
      })
    };

    es = new EventSource('https://api.pams.ishortv.top/sse/connect', { withCredentials: true });
    es.addEventListener('returnHonor', e => proceedMessage(e.data));
    es.addEventListener('recoverHonor', e => proceedMessage(e.data));
  }
});

onUnmounted(() => es && es.close());
</script>

<style lang="scss">
@use '@/assets/style/layouts/default' as *;
</style>