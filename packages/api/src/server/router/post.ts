import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod/v4'

import { desc, eq } from '@workspace/db'
import { post, postInsertSchema } from '@workspace/db/schema'

import { protectedProcedure, publicProcedure } from '../trpc'

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.post.findMany({
      orderBy: desc(post.id),
      limit: 50,
    })
  }),

  byId: publicProcedure.input(z.object({ id: z.int() })).query(({ ctx, input }) => {
    return ctx.db.query.post.findFirst({
      where: eq(post.id, input.id),
    })
  }),

  create: protectedProcedure.input(postInsertSchema).mutation(({ ctx, input }) => {
    return ctx.db.insert(post).values(input)
  }),

  delete: protectedProcedure.input(z.int()).mutation(({ ctx, input }) => {
    return ctx.db.delete(post).where(eq(post.id, input))
  }),
} satisfies TRPCRouterRecord
