export default defineNuxtRouteMiddleware(() => {
  const admin = useAdmin().value;
  if(!admin) {
    ElMessage({ type: 'error', message: '你未被授权' });
    return navigateTo('/login');
  }
});