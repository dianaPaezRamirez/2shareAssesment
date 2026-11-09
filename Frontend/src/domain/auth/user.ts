export interface User {
  id: string
  username: string
  fullName: string
}

export interface Session {
  token: string
  expiresAt: string
  user: User
}

export function isSessionExpired(session: Session, now: number = Date.now()): boolean {
  return new Date(session.expiresAt).getTime() <= now
}
