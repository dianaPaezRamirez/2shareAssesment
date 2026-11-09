import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/ui/hooks/useAuth'

// Pages that require a session. Without one, nothing is shown and the user goes to the login page.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
