import { z } from 'zod'

// Same rules as the API (RegisterRequest / LoginRequest), so most errors are shown before sending the form.
export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 50
export const FULL_NAME_MAX_LENGTH = 100
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_LENGTH = 100

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Enter your username.'),
  password: z.string().min(1, 'Enter your password.'),
})

export const registrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(USERNAME_MIN_LENGTH, `Username must have at least ${USERNAME_MIN_LENGTH} characters.`)
    .max(USERNAME_MAX_LENGTH, `Username must have at most ${USERNAME_MAX_LENGTH} characters.`)
    .regex(/^[a-zA-Z0-9._-]+$/, 'Use only letters, numbers, dots, hyphens and underscores.'),
  fullName: z
    .string()
    .trim()
    .min(1, 'Enter your full name.')
    .max(FULL_NAME_MAX_LENGTH, `Full name must have at most ${FULL_NAME_MAX_LENGTH} characters.`),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must have at least ${PASSWORD_MIN_LENGTH} characters.`)
    .max(PASSWORD_MAX_LENGTH, `Password must have at most ${PASSWORD_MAX_LENGTH} characters.`),
})

export type LoginCredentials = z.infer<typeof loginSchema>
export type RegistrationData = z.infer<typeof registrationSchema>
