export default defineNuxtRouteMiddleware(() => {
  if(process.client) return;
  
  const admin = useCookie('is_admin').value;
  if(!admin) return navigateTo('/login');
});