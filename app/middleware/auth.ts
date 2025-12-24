export default defineNuxtRouteMiddleware((to, from) => {
  // Apenas executar no cliente
  if (process.server) return

  const token = localStorage.getItem('auth_token')

  // Se não tiver token e estiver tentando acessar rota admin (exceto login)
  if (!token && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }

  // Se tiver token e estiver tentando acessar login, redirecionar para dashboard
  if (token && to.path === '/admin/login') {
    return navigateTo('/admin/dashboard')
  }
})
