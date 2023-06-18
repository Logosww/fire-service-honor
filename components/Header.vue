<template>
  <div class="header-title">
    <a href="/" target="_self">
      <img class="header-logo" src="https://pams-1318030356.cos.ap-shanghai.myqcloud.com/logo.png">
    </a>
    <h1>杭州消防救援支队典型事迹管理系统</h1>
  </div>
  <div class="header-operation">
    <span class="header-welcome">{{ username }} 您好！</span>
    <ThemeToggler class="header-theme-toggler" />
    <el-button-group>
      <el-button :icon="ElIconLock" @click="dialogVisible = true" round>修改密码</el-button>
      <ClientOnly>
        <el-popconfirm title="确认登出吗？" confirm-button-text="确认" cancel-button-text="取消" @confirm="handleLogout">
          <template #reference>
            <el-button :icon="ElIconSwitchButton" round>登出</el-button>
          </template>
        </el-popconfirm>
      </ClientOnly>
    </el-button-group>
  </div>
  <ClientOnly>
    <el-dialog width="380" v-model="dialogVisible" title="修改密码" @closed="restoreForm(form, formRef)" align-center>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100">
        <el-form-item prop="oldPassword" label="旧密码">
          <el-input v-model="form.oldPassword" />
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码">
          <el-input v-model="form.newPassword" type="password" />
        </el-form-item>
        <el-form-item prop="reNewPassword" label="确认新密码">
          <el-input v-model="form.reNewPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleModifyPwd">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>>
      </template>
    </el-dialog>
  </ClientOnly>
</template>

<script lang="ts" setup>

import type { FormInstance, FormRules } from 'element-plus';

const username = ref('');
const dialogVisible = ref(false);

const formRef = ref<FormInstance>();

const form = reactive({
  oldPassword: '',
  newPassword: '',
  reNewPassword: ''
});

const rules: FormRules = {
  oldPassword: { required: true, trigger: 'blur', message: '请输入旧密码' },
  newPassword: { required: true, trigger: 'blur', message: '请输入新密码'},
  reNewPassword: { 
    required: true, 
    trigger: 'blur', 
    validator(_rule: any, value: string, cb: (err: Error) => void) {
      if(value !== form.newPassword) 
        cb(new Error('两次密码输入不一致'));
    }
  },
};

const handleLogout = async () => {
  await useLogout();
  useAuth().value = false;
  useAdmin().value = false;
  navigateTo('/');
  ElNotification({ type: 'success', message: '登出成功' });
};

const handleModifyPwd = () => {
  formRef.value?.validate(async valid => {
    if(!valid) return;

    const result = await useModifyPassword({
      oldPasswd: form.oldPassword,
      newPasswd: form.newPassword
    });
    if(!result) ElMessage({ type: 'error', message: '旧密码错误' });
    else {
      dialogVisible.value = false;
      ElNotification({ type: 'success', message: '密码修改成功' });
    }
  });
};

onMounted(() => {
  username.value = localStorage.getItem('username') ?? '';
});
</script>

<style lang="scss">
  @use '@/assets/style/components/header' as *;
</style>