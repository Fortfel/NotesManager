import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod/v4'

import { and, desc, eq } from '@workspace/db'
import { node, nodeInsertSchema, page, pageInsertSchema } from '@workspace/db/schema'

import { protectedProcedure, publicProcedure } from '../trpc'

export const noteRouter = {
  // Get all pages for the current user
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.page.findMany({
      where: eq(page.userId, ctx.session.session.userId),
      orderBy: desc(page.updatedAt),
      with: {
        nodes: true,
      },
    })
  }),

  // Get a single page by ID with all its nodes
  byId: protectedProcedure.input(z.object({ id: z.uuid() })).query(({ ctx, input }) => {
    return ctx.db.query.page.findFirst({
      where: and(eq(page.id, input.id), eq(page.userId, ctx.session.session.userId)),
      with: {
        nodes: true,
      },
    })
  }),

  // Get a page by slug
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.db.query.page.findFirst({
      where: eq(page.slug, input.slug),
      with: {
        nodes: true,
      },
    })
  }),

  // Create a new page with nodes
  create: protectedProcedure
    .input(
      z.object({
        page: pageInsertSchema,
        nodes: z.array(nodeInsertSchema).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Insert the page
      await ctx.db.insert(page).values({
        ...input.page,
        userId: ctx.session.session.userId,
      })

      // Insert nodes if provided
      if (input.nodes && input.nodes.length > 0) {
        await ctx.db.insert(node).values(
          input.nodes.map((n) => ({
            ...n,
            pageId: input.page.id,
          })),
        )
      }

      return { id: input.page.id }
    }),

  // Update a page (metadata only, not nodes)
  update: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        title: z.string().max(256).optional(),
        slug: z.string().max(256).optional(),
        cover: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...updates } = input
      return ctx.db
        .update(page)
        .set(updates)
        .where(and(eq(page.id, id), eq(page.userId, ctx.session.session.userId)))
    }),

  // Delete a page (cascades to nodes)
  delete: protectedProcedure.input(z.uuid()).mutation(({ ctx, input }) => {
    return ctx.db.delete(page).where(and(eq(page.id, input), eq(page.userId, ctx.session.session.userId)))
  }),

  // Update nodes for a page (replaces all nodes)
  updateNodes: protectedProcedure
    .input(
      z.object({
        pageId: z.uuid(),
        nodes: z.array(nodeInsertSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify page ownership
      const pageExists = await ctx.db.query.page.findFirst({
        where: and(eq(page.id, input.pageId), eq(page.userId, ctx.session.session.userId)),
      })

      if (!pageExists) {
        throw new Error('Page not found')
      }

      // Delete existing nodes
      await ctx.db.delete(node).where(eq(node.pageId, input.pageId))

      // Insert new nodes
      if (input.nodes.length > 0) {
        await ctx.db.insert(node).values(
          input.nodes.map((n) => ({
            ...n,
            pageId: input.pageId,
          })),
        )
      }

      return { success: true }
    }),
} satisfies TRPCRouterRecord
