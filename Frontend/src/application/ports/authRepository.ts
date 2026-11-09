import type { LoginCredentials, RegistrationData } from '@/domain/auth/authSchemas'
import type { Session } from '@/domain/auth/user'

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<Session>
  register(data: RegistrationData): Promise<Session>
}
