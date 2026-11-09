import { createAuthUseCases } from '@/application/auth/authUseCases'
import { createGroceryListUseCases } from '@/application/grocery/groceryListUseCases'
import { createHttpAuthRepository } from '@/infrastructure/auth/httpAuthRepository'
import { env } from '@/infrastructure/config/env'
import { createHttpGroceryItemRepository } from '@/infrastructure/grocery/httpGroceryItemRepository'
import { createHttpClient } from '@/infrastructure/http/httpClient'
import { useSessionStore } from '@/store/sessionStore'

// Composition root: the only place that knows which adapter implements each port.
const httpClient = createHttpClient({
  baseUrl: env.apiUrl,
  getToken: () => useSessionStore.getState().session?.token ?? null,
  onUnauthorized: () => useSessionStore.getState().clearSession(),
})

export const authUseCases = createAuthUseCases(createHttpAuthRepository(httpClient))

export const groceryListUseCases = createGroceryListUseCases(createHttpGroceryItemRepository(httpClient))
