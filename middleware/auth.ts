export default defineNuxtRouteMiddleware(() => {
  if(process.client) return;
  
  const auth = useCookie('token').value;
  if(!auth) return navigateTo('/login');
});