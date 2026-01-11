import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastify from 'fastify'

import { fastifyTRPCPlugin } from '@workspace/api/server'
import { initAuth } from '@workspace/auth/server'
import { createDatabase } from '@workspace/db/client'

import { getLoggerConfig } from '#/config'
import { env } from '#/env'
import { authHandler } from '#/lib/auth'
import { getFastifyTRPCPluginOptions } from '#/lib/trpc'

const db = createDatabase({
  url: env.DATABASE_URL,
})

const auth = initAuth({
  db,
  webUrl: env.CLIENT_URL,
  serverUrl: env.SERVER_URL,
  apiPath: env.SERVER_API_PATH,
  authSecret: env.AUTH_SECRET,
})

export function createServer(): {
  server: FastifyInstance
  start: () => Promise<void>
  stop: () => Promise<void>
} {
  // Initialize Fastify
  const server: FastifyInstance = fastify({
    logger: getLoggerConfig(env.NODE_ENV) || true,
  })

  // Security plugins
  server.register(fastifyHelmet)

  server.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86_400,
  })

  server.register(fastifyRateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
  })

  server.register(fastifyCookie)

  // Auth endpoint
  server.route({
    method: ['GET', 'POST'],
    url: `${env.SERVER_API_PATH}/auth/*`,
    handler: authHandler(server, auth),
  })

  server.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.redirect(env.CLIENT_URL)
    // return reply.send({ message: 'API is running!' })
  })

  if (env.SERVER_API_PATH !== '/') {
    server.get(env.SERVER_API_PATH + '/', async (_request: FastifyRequest, reply: FastifyReply) => {
      return reply.redirect(env.CLIENT_URL)
      // return reply.send({ message: 'API is running!' })
    })
  }

  // TRPC plugin
  server.register(fastifyTRPCPlugin, getFastifyTRPCPluginOptions(db, auth))

  server.setErrorHandler((error, request, reply) => {
    const isProduction = env.NODE_ENV === 'production'

    // Log the full error server-side
    server.log.error(
      {
        err: error,
        url: request.url,
        method: request.method,
      },
      'Unhandled error',
    )

    const statusCode = error instanceof Error && 'statusCode' in error ? Number(error.statusCode) : 500

    // Send sanitized error to client
    if (isProduction) {
      reply.status(statusCode).send({
        error: {
          statusCode,
          message: 'Internal server error',
        },
      })
    } else {
      reply.status(statusCode).send({
        error: {
          statusCode,
          ...(error instanceof Error && error.name ? { name: error.name } : {}),
          ...(error instanceof Error && error.message
            ? { message: error.message }
            : { message: 'Internal server error' }),
          ...(error instanceof Error && error.cause ? { cause: error.cause } : {}),
          ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
        },
      })
    }
  })

  const stop = async (): Promise<void> => {
    try {
      await db.$client.end()
      server.log.info('Database connection pool closed')
    } catch (error) {
      server.log.error({ err: error }, 'Error closing database connection pool')
    }

    await server.close()
  }

  const start = async (): Promise<void> => {
    try {
      const address = await server.listen({ port: env.SERVER_PORT, host: '127.0.0.1' })

      server.log.info(`Server running at ${address}`)
      server.log.info(`Environment: ${env.NODE_ENV}`)
    } catch (err) {
      // Ensure database pool is closed even if server start fails
      try {
        await db.$client.end()
      } catch (dbError) {
        server.log.error({ err: dbError }, 'Error closing database pool during startup failure')
      }
      server.log.error(err)
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }
  }

  return { server, start, stop }
}
