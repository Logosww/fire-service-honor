<template>
  <div class="wrapper">
    <div :class="['header-wrapper', scrollY > 40 ? 'transparent' : '']">
      <div class="header">
        <div class="header-inner">
          <div class="logo">
            <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/logo.png" alt="">
            <h1 class="title">杭州市消防救援支队</h1>
            <h3 id="department"></h3>
          </div>
          <div class="login-container">
            <el-button :icon="ElIconUserFilled" type="primary" @click="navigateTo('/login')" plain round>登录</el-button>
          </div>
        </div>
      </div>
      <div class="navbar">
        <div class="navbar-inner">
          <a 
            :class="['navbar-item', activeNav === index ? 'active' : '']"
            v-for="(item, index) in navs"
            :key="index" :href="`#${item}`"
            @click="activeNav = index"
          >
            {{ item }}
          </a>
        </div>
      </div>
    </div>
    <section class="main">
      <main>
        <slot />
      </main>
    </section>
    <div class="footer">
      <div class="footer-img"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { navsKey } from '@/tokens';


const navs = ref<string[]>([]);
const activeNav = ref(-1);

const wrapperRef = ref<HTMLElement>();

const { y: scrollY } = useWindowScroll();

provide(navsKey, navs);
</script>

<style lang="scss">
  @use '@/assets/style/index' as *;
</style>