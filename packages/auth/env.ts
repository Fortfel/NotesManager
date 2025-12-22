import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const authEnv = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === 'production'
        ? z.string().min(32, 'BetterAuth secret must be at least 32 characters')
        : z.string().min(1).default('better-auth-secret-123456789'),

    AUTH_GOOGLE_CLIENT_ID: z.string().min(1),
    AUTH_GOOGLE_CLIENT_SECRET: z.string().min(1),
    AUTH_DISCORD_CLIENT_ID: z.string().min(1),
    AUTH_DISCORD_CLIENT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
})

export type AuthEnvType = typeof authEnv
