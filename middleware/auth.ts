export default defineNuxtRouteMiddleware(() => {
  const auth = useAuth().value;
  if(!auth) {
    ElMessage({ type: 'error', message: '你还未登录' });
    return navigateTo('/login');
  }
})