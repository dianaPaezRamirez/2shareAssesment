import type { LoginCredentials, RegistrationData } from '@/domain/auth/authSchemas'
import type { Session } from '@/domain/auth/user'
import type { AuthRepository } from '@/application/ports/authRepository'

export interface AuthUseCases {
  login(credentials: LoginCredentials): Promise<Session>
  register(data: RegistrationData): Promise<Session>
}

export function createAuthUseCases(repository: AuthRepository): AuthUseCases {
  return {
    login: (credentials) => repository.login(credentials),
    register: (data) => repository.register(data),
  }
}
