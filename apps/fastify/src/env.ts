import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

import './load-env'

import { authEnv } from '@workspace/auth/env'

const baseEnv = createEnv({
  extends: [authEnv],
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Server
    SERVER_PORT: z.coerce.number().positive().min(1).max(65_535).default(3000),
    SERVER_URL: z.url({
      protocol: /^https?$/,
      hostname: z.regexes.hostname,
      error: 'Invalid server URL',
    }),
    SERVER_API_PATH: z
      .string()
      .startsWith('/', { error: 'API Path must start with "/" if provided.' })
      .refine((val) => val === '/' || !val.endsWith('/'), {
        error: 'API Path must not end with "/" unless it is exactly "/"',
      })
      .default('/api'),

    // Frontend
    CLIENT_URL: z.url({
      protocol: /^https?$/,
      hostname: z.regexes.hostname,
      error: 'Invalid client URL',
    }),

    // Database
    DATABASE_URL: z.url('Invalid database URL'),

    // Rate Limiter
    RATE_LIMIT_MAX: z.coerce.number().positive(),
    RATE_LIMIT_WINDOW: z.coerce.number().positive(),

    // CORS (comma-separated for multiple origins)
    CORS_ORIGIN: z
      .string()
      .default('')
      .transform((val) => {
        if (!val || val.trim() === '') {
          return []
        }
        return val
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean) // Remove empty strings
      })
      .pipe(
        z.array(
          z.url({
            protocol: /^https?$/,
            hostname: z.regexes.hostname,
            error: 'Invalid CORS origin',
          }),
        ),
      ),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  // clientPrefix: 'PUBLIC_',

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client.
   */
  // client: {
  //   PUBLIC_CLIENTVAR: z.string(),
  // },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === 'lint',

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})

// Post-process to add CLIENT_URL to CORS_ORIGIN
export const env = {
  ...baseEnv,
  CORS_ORIGIN: ((): Array<string> => {
    // First normalize all URLs to origins
    const allOrigins = [...baseEnv.CORS_ORIGIN.map((url) => new URL(url).origin), new URL(baseEnv.CLIENT_URL).origin]

    // Then deduplicate
    return [...new Set(allOrigins)]
  })(),
}

export type Env = typeof env
