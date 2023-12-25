<template>
  <div class="wrapper">
    <div class="container">
      <header class="header">
        <div class="logo">
          <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/logo.png" alt="">
          <h1 class="title">杭州市消防救援支队</h1>
          <h3 class="sub-title">先锋典型库</h3>
        </div>
        <a class="login-btn" href="/login" target="_self">
          <el-icon><ElIconUserFilled /></el-icon>
        </a>
      </header>
      <main class="main">
        <slot />
      </main>
      <footer class="footer" v-if="useRoute().path !== '/'">
        <div class="footer-mask"></div>
        <div class="footer-img"></div>
      </footer>
      <p class="footer-info">© 2012-2023 杭州消防救援支队/技术支持：qikuo</p>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@/assets/style/layouts/index' as *;
</style>