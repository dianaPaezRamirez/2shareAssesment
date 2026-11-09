import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/ui/hooks/useAuth'

// Login and register pages. A user who is already logged in goes straight to the grocery list.
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
