import { z } from 'zod'
import type { AuthRepository } from '@/application/ports/authRepository'
import type { HttpClient } from '@/infrastructure/http/httpClient'

const authResponseSchema = z.object({
  token: z.string(),
  expiresAt: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
  }),
})

export function createHttpAuthRepository(http: HttpClient): AuthRepository {
  return {
    login: (credentials) => http.post('/api/auth/login', credentials, authResponseSchema),
    register: (data) => http.post('/api/auth/register', data, authResponseSchema),
  }
}
