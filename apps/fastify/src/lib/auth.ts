import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

import type { AuthInstance } from '@workspace/auth/server'

export function authHandler(
  fastify: FastifyInstance,
  auth: AuthInstance,
): (request: FastifyRequest, reply: FastifyReply) => Promise<void> {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host as string}`)

      // Convert Fastify headers to standard Headers object
      const headers = new Headers()
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString())
      })

      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      })

      // Process authentication request
      const response = await auth.handler(req)

      // Forward response to client
      reply.status(response.status)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      response.headers.forEach((value, key) => reply.header(key, value))
      reply.send(response.body ? await response.text() : null)
    } catch (error) {
      fastify.log.error({ err: error }, 'Authentication Error')
      reply.status(500).send({
        error: 'Internal authentication error',
        code: 'AUTH_FAILURE',
      })
    }
  }
}
