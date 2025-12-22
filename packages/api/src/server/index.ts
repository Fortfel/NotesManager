import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import type { appRouter } from './router'

// type definition of API
type AppRouter = typeof appRouter

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? \{ id: number \}
 **/
type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>

export { createTRPCContext } from './trpc'
export { appRouter } from './router'
export type { AppRouter, RouterInputs, RouterOutputs }
export { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
export type { CreateFastifyContextOptions, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify'
