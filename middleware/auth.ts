export default defineNuxtRouteMiddleware(() => {
  if(process.client) return;

  const auth = useAuth().value;
  if(!auth) return navigateTo('/login');
});