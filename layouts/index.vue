<template>
  <div class="wrapper">
    <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/bg_head.png" class="bg-image">
    <header class="header">
      <div class="logo">
        <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/logo.png" alt="">
        <h1 class="title">杭州市消防救援支队</h1>
      </div>
      <a class="login-btn" href="/login" target="_self">
        <el-icon><ElIconUserFilled /></el-icon>
      </a>
      <h3 class="sub-title">支队先锋典型库</h3>
    </header>
    <main class="main">
      <slot />
    </main>
    <footer class="footer">
      <div class="footer-mask"></div>
      <div class="footer-img"></div>
    </footer>
  </div>
</template>

<style lang="scss">
  @use '@/assets/style/layouts/index' as *;
</style>