import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  outDir: 'dist',
  clean: true,
  sourcemap: false,
  minify: true,

  // Bundle workspace packages but exclude external deps
  noExternal: [/^@workspace\//],

  // External dependencies (don't bundle these)
  external: [
    // Fastify ecosystem
    'fastify',
    '@fastify/cookie',
    '@fastify/cors',
    '@fastify/helmet',
    '@fastify/rate-limit',

    // Database & Auth (native/complex deps)
    'mysql2',
    'better-auth',
    'drizzle-orm',
    'drizzle-zod',

    // Other large deps
    '@trpc/server',
    '@t3-oss/env-core',
    'superjson',
    'zod',
  ],

  // Handle TypeScript compilation for workspace packages
  esbuildOptions(options) {
    options.resolveExtensions = ['.ts', '.tsx', '.js', '.jsx']
    options.conditions = ['typescript']
  },
})
