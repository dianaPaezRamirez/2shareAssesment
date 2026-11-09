export type ApplicationErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'notFound'
  | 'conflict'
  | 'network'
  | 'unexpected'

export class ApplicationError extends Error {
  readonly kind: ApplicationErrorKind
  readonly fieldErrors: Record<string, string>

  constructor(kind: ApplicationErrorKind, message: string, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApplicationError'
    this.kind = kind
    this.fieldErrors = fieldErrors
  }
}

export function getErrorMessage(error: unknown): string {
  return error instanceof ApplicationError ? error.message : 'Something went wrong. Please try again.'
}
