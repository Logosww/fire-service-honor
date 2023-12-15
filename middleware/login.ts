export default defineNuxtRouteMiddleware(async () => {
  if(process.client) return;
  
  const auth = useCookie('token').value;
  if(auth) return navigateTo('/admin');
});