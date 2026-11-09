import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.url(),
})

const result = envSchema.safeParse(import.meta.env)

if (!result.success) {
  throw new Error('VITE_API_URL is missing or is not a valid URL. See Frontend/.env.example.')
}

export const env = {
  apiUrl: result.data.VITE_API_URL.replace(/\/+$/, ''),
}
