import { z } from 'zod'
import { ApplicationError, type ApplicationErrorKind } from '@/application/errors/applicationError'

// RFC 9457 body returned by the API for every error.
const problemDetailsSchema = z.object({
  title: z.string().optional(),
  detail: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
})

const kindByStatus: Record<number, ApplicationErrorKind> = {
  400: 'validation',
  401: 'unauthorized',
  404: 'notFound',
  409: 'conflict',
}

const defaultMessageByKind: Record<ApplicationErrorKind, string> = {
  validation: 'Some fields are not valid.',
  unauthorized: 'Your session has expired. Please log in again.',
  notFound: 'The product no longer exists.',
  conflict: 'The request conflicts with existing data.',
  network: 'Could not connect to the server. Please try again.',
  unexpected: 'Something went wrong. Please try again.',
}

export async function toApplicationError(response: Response): Promise<ApplicationError> {
  const kind = kindByStatus[response.status] ?? 'unexpected'
  const body: unknown = await response.json().catch(() => null)
  const parsed = problemDetailsSchema.safeParse(body)

  if (!parsed.success) {
    return new ApplicationError(kind, defaultMessageByKind[kind])
  }

  const { title, detail, errors } = parsed.data
  const message = detail ?? (kind === 'validation' ? defaultMessageByKind.validation : title) ?? defaultMessageByKind[kind]

  return new ApplicationError(kind, message, toFieldErrors(errors))
}

export function networkError(): ApplicationError {
  return new ApplicationError('network', defaultMessageByKind.network)
}

export function unexpectedResponseError(): ApplicationError {
  return new ApplicationError('unexpected', 'The server returned an unexpected response.')
}

// The API returns field names as "Username"; the forms use "username".
function toFieldErrors(errors: Record<string, string[]> = {}): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([, messages]) => messages.length > 0)
      .map(([field, messages]) => [field.charAt(0).toLowerCase() + field.slice(1), messages[0]]),
  )
}
