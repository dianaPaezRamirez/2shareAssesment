import axios, { type AxiosRequestConfig } from 'axios'
import type { z } from 'zod'
import { networkError, toApplicationError, unexpectedResponseError } from './problemDetails'

const REQUEST_TIMEOUT_MS = 10_000

export interface HttpClientOptions {
  baseUrl: string
  getToken: () => string | null
  onUnauthorized: () => void
}

export interface HttpClient {
  get<T>(path: string, schema: z.ZodType<T>): Promise<T>
  post<T>(path: string, body: unknown, schema: z.ZodType<T>): Promise<T>
  patch<T>(path: string, schema: z.ZodType<T>): Promise<T>
  delete(path: string): Promise<void>
}

export function createHttpClient({ baseUrl, getToken, onUnauthorized }: HttpClientOptions): HttpClient {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { Accept: 'application/json' },
  })

  instance.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      // No response at all: the API is down, the network failed or the request timed out.
      if (!axios.isAxiosError(error) || !error.response) {
        throw networkError()
      }

      const { status, data } = error.response

      // A 401 with a token means the session is no longer valid (for example, it expired).
      // A 401 without a token is a failed login and is handled by the form.
      if (status === 401 && error.config?.headers.Authorization) {
        onUnauthorized()
      }

      throw toApplicationError(status, data)
    },
  )

  async function request<T>(config: AxiosRequestConfig, schema: z.ZodType<T>): Promise<T> {
    const { data } = await instance.request<unknown>(config)
    const result = schema.safeParse(data)
    if (!result.success) {
      throw unexpectedResponseError()
    }
    return result.data
  }

  return {
    get: (path, schema) => request({ method: 'GET', url: path }, schema),
    post: (path, body, schema) => request({ method: 'POST', url: path, data: body }, schema),
    patch: (path, schema) => request({ method: 'PATCH', url: path }, schema),
    delete: async (path) => {
      await instance.delete(path)
    },
  }
}
