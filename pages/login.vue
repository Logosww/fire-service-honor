<template>
  <div class="login-wrapper" >
    <div class="login-header">
      <img src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/logo.png" alt="">
      <h1>杭州市消防救援支队</h1>
    </div>
    <el-card class="login-form">
      <h2>系统登录</h2>
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input placeholder="用户名" v-model="form.username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="密码" type="password" v-model="form.password" @keydown.enter="handleLogin" />
        </el-form-item>
        <el-form-item prop="keepLogin">
          <el-checkbox v-model="form.rememberMe">记住我</el-checkbox>
        </el-form-item>
      </el-form>
      <el-button class="login-btn" type="primary" @click="handleLogin">登录</el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">

import type { FormInstance, FormRules } from 'element-plus';

definePageMeta({
  layout: false
});

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const formRef = ref<FormInstance>();
const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
};

const handleLogin = () => {
  formRef.value?.validate(async valid => {
    if(!valid) return;
    
    const isAdmin = await useLogin(form);
    useAuth().value = true;
    useAdmin().value = isAdmin;
    ElNotification({ type: 'success', message: '登录成功' });
    localStorage.setItem('username', form.username);
    form.rememberMe && localStorage.setItem('keep-auth', 'true');
    return navigateTo('/');
  });
};

onMounted(() => {
  const keepAuth = localStorage.getItem('keep-auth') === 'true';
  if(keepAuth) {
    form.rememberMe = keepAuth;
    form.username = localStorage.getItem('username') ?? '';
  }
});

</script>

<style lang="scss">
@use '@/assets/style/login' as *;
</style>