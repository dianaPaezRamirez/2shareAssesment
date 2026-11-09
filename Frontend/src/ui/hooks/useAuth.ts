import { useCallback } from 'react'
import type { LoginCredentials, RegistrationData } from '@/domain/auth/authSchemas'
import { isSessionExpired } from '@/domain/auth/user'
import { authUseCases } from '@/dependencies'
import { useSessionStore } from '@/store/sessionStore'

export function useAuth() {
  const session = useSessionStore((state) => state.session)
  const setSession = useSessionStore((state) => state.setSession)
  const clearSession = useSessionStore((state) => state.clearSession)

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setSession(await authUseCases.login(credentials))
    },
    [setSession],
  )

  const register = useCallback(
    async (data: RegistrationData) => {
      setSession(await authUseCases.register(data))
    },
    [setSession],
  )

  const isAuthenticated = session !== null && !isSessionExpired(session)

  return {
    user: isAuthenticated ? session.user : null,
    isAuthenticated,
    login,
    register,
    logout: clearSession,
  }
}
