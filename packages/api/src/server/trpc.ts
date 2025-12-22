/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { initTRPC, TRPCError } from '@trpc/server'
import SuperJSON from 'superjson'
import { z, ZodError } from 'zod'

import type { AuthInstance } from '@workspace/auth/server'
import type { DatabaseInstance } from '@workspace/db/client'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
interface CreateContextOptions extends CreateFastifyContextOptions {
  auth: AuthInstance
  db: DatabaseInstance
}

export const createTRPCContext = async ({ req, res, auth, db }: CreateContextOptions) => {
  // Convert Fastify headers to standard Headers object
  const headers = new Headers()

  Object.entries(req.headers).forEach(([key, value]) => {
    if (value) headers.append(key, value.toString())
  })

  const authApi = auth.api
  const session = await authApi.getSession({
    headers,
  })

  return {
    req,
    res,
    authApi,
    session,
    db,
  }
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError ? z.flattenError(error.cause as ZodError<Record<string, unknown>>) : null,
    },
  }),
})

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path, type }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()
  const end = Date.now()

  // Only log in development
  if (t._config.isDev) {
    const duration = Math.round(end - start)
    // const color = duration > 1000 ? '\x1b[31m' : duration > 500 ? '\x1b[33m' : '\x1b[32m'
    // const reset = '\x1b[0m'
    // prettier-ignore
    const color = duration > 1000 ? '\u001B[31m' : (duration > 500 ? '\u001B[33m' : '\u001B[32m')
    const reset = '\u001B[0m'
    console.log(`[TRPC]  ${color}${type}${reset} ${path} - ${color}${duration.toString()}ms${reset}`)
  }

  return result
})

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(timingMiddleware).use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
