import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'
import { z } from 'zod/v4'

import { and, asc, count, desc, eq } from '@workspace/db'
import { node, nodeInsertSchema, page, pageInsertSchema } from '@workspace/db/schema'

import { DEMO_USER } from '../../config'
import { protectedProcedure, publicProcedure } from '../trpc'

export const noteRouter = {
  // Get all pages for the current user
  all: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(20),
        offset: z.number().min(0).optional().default(0),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.page.findMany({
        where: eq(page.userId, ctx.session.session.userId),
        orderBy: desc(page.updatedAt),
        limit: input.limit,
        offset: input.offset,
        with: {
          nodes: {
            orderBy: asc(node.order),
          },
        },
      })
    }),

  // Get a single page by ID with all its nodes
  byId: protectedProcedure.input(z.object({ id: z.uuid() })).query(({ ctx, input }) => {
    return ctx.db.query.page.findFirst({
      where: and(eq(page.id, input.id), eq(page.userId, ctx.session.session.userId)),
      with: {
        nodes: {
          orderBy: asc(node.order),
        },
      },
    })
  }),

  // Get a page by slug
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ ctx, input }) => {
    return ctx.db.query.page.findFirst({
      where: eq(page.slug, input.slug),
      with: {
        nodes: {
          orderBy: asc(node.order),
        },
      },
    })
  }),

  // Create a new page with nodes
  create: protectedProcedure
    .input(
      z.object({
        page: pageInsertSchema.omit({ userId: true }),
        nodes: z.array(nodeInsertSchema).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check demo user page limit
      if (ctx.session.user.email === DEMO_USER.email) {
        const [result] = await ctx.db
          .select({ count: count() })
          .from(page)
          .where(eq(page.userId, ctx.session.session.userId))

        if (result && result.count >= DEMO_USER.maxPages) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Demo account is limited to ${DEMO_USER.maxPages.toString()} pages. Delete some pages to create new ones.`,
          })
        }
      }

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
    .mutation(async ({ ctx, input }) => {
      // Check if demo user is trying to update protected pages
      if (ctx.session.user.email === DEMO_USER.email) {
        const targetPage = await ctx.db.query.page.findFirst({
          where: and(eq(page.id, input.id), eq(page.userId, ctx.session.session.userId)),
        })

        if (targetPage && DEMO_USER.protectedPageSlugs.has(targetPage.slug)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Demo account cannot modify the example pages. Create your own pages to edit them.',
          })
        }
      }

      const { id, ...updates } = input
      return ctx.db
        .update(page)
        .set(updates)
        .where(and(eq(page.id, id), eq(page.userId, ctx.session.session.userId)))
    }),

  // Delete a page (cascades to nodes)
  delete: protectedProcedure.input(z.uuid()).mutation(async ({ ctx, input }) => {
    // Check if demo user is trying to delete protected pages
    if (ctx.session.user.email === DEMO_USER.email) {
      const targetPage = await ctx.db.query.page.findFirst({
        where: and(eq(page.id, input), eq(page.userId, ctx.session.session.userId)),
      })

      if (targetPage && DEMO_USER.protectedPageSlugs.has(targetPage.slug)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Demo account cannot delete the example pages.',
        })
      }
    }

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
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Page not found',
        })
      }

      // Check if demo user is trying to update protected pages
      if (ctx.session.user.email === DEMO_USER.email && DEMO_USER.protectedPageSlugs.has(pageExists.slug)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Demo account cannot modify the example pages. Create your own pages to edit them.',
        })
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
