export default defineNuxtRouteMiddleware(() => {
  if(process.client) return;
  
  const isAdmin = useAdmin().value;
  if(!isAdmin) return navigateTo('/login');
});