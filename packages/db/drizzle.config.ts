import { defineConfig } from 'drizzle-kit'

import { env } from '../../apps/fastify/src/env'

export default defineConfig({
  out: './drizzle',
  schema: './src/schema.ts',
  dialect: 'mysql',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
