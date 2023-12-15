export const useAuth = 
  () => useState('auth', () => !!useCookie('token').value);

export const useAdmin =
  () => useState('admin', () => !!useCookie('is_admin').value);