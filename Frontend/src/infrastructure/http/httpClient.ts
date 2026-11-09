import type { z } from 'zod'
import { networkError, toApplicationError, unexpectedResponseError } from './problemDetails'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

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
  async function send(method: HttpMethod, path: string, body?: unknown): Promise<unknown> {
    const headers = new Headers({ Accept: 'application/json' })
    const token = getToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    if (body !== undefined) {
      headers.set('Content-Type', 'application/json')
    }

    let response: Response
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      })
    } catch {
      throw networkError()
    }

    if (!response.ok) {
      // A 401 with a token means the session is no longer valid (for example, it expired).
      // A 401 without a token is a failed login and is handled by the form.
      if (response.status === 401 && token) {
        onUnauthorized()
      }
      throw await toApplicationError(response)
    }

    return response.status === 204 ? undefined : response.json()
  }

  async function request<T>(method: HttpMethod, path: string, schema: z.ZodType<T>, body?: unknown): Promise<T> {
    const result = schema.safeParse(await send(method, path, body))
    if (!result.success) {
      throw unexpectedResponseError()
    }
    return result.data
  }

  return {
    get: (path, schema) => request('GET', path, schema),
    post: (path, body, schema) => request('POST', path, schema, body),
    patch: (path, schema) => request('PATCH', path, schema),
    delete: async (path) => {
      await send('DELETE', path)
    },
  }
}
