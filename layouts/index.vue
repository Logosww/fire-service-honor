<template>
  <div class="wrapper">
    <div class="header">
      <div class="header-inner">
        <div class="logo">
          <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/logo.png" alt="">
          <h1 class="title">杭州市消防救援支队</h1>
          <h3 id="department"></h3>
        </div>
        <div class="login-wrapper">
          <el-button :icon="ElIconUserFilled" type="primary" @click="navigateTo('/login')" plain round>登录</el-button>
        </div>
      </div>
    </div>
    <div class="navbar"></div>
    <section class="main">
      <slot />
    </section>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss">
  @use '@/assets/style/index' as *;
</style>