import { relations } from 'drizzle-orm'
import { mysqlTable, timestamp } from 'drizzle-orm/mysql-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { user as userTable } from './auth'

const timestamps = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
}

// Node types enum for validation
export const nodeTypes = ['text', 'list', 'page', 'heading1', 'heading2', 'heading3'] as const

// Page table
export const page = mysqlTable('page', (t) => ({
  id: t.varchar({ length: 36 }).primaryKey(),
  slug: t.varchar({ length: 256 }).notNull().unique(),
  title: t.varchar({ length: 256 }).notNull(),
  cover: t.text(),
  ...timestamps,
  userId: t
    .varchar({ length: 36 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
}))

// Node table - stores individual nodes for each page
export const node = mysqlTable('node', (t) => ({
  id: t.varchar({ length: 36 }).primaryKey(),
  type: t.mysqlEnum(nodeTypes).notNull(),
  value: t.text().notNull(),
  pageId: t
    .varchar({ length: 36 })
    .notNull()
    .references(() => page.id, { onDelete: 'cascade' }),
}))

// Zod schemas for validation
export const nodeDataSchema = z.object({
  id: z.uuid(),
  type: z.enum(nodeTypes),
  value: z.string(),
})

export const pageInsertSchema = createInsertSchema(page, {
  id: z.uuid(),
  userId: z.uuid(),
  slug: z.string().max(256),
  title: z.string().max(256),
  cover: z.string().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
})

export const nodeInsertSchema = createInsertSchema(node, {
  id: z.uuid(),
  pageId: z.uuid(),
  type: z.enum(nodeTypes),
  value: z.string(),
})

// Relations
export const userRelations = relations(userTable, ({ many }) => ({
  pages: many(page),
}))

export const pageRelations = relations(page, ({ one, many }) => ({
  user: one(userTable, {
    fields: [page.userId],
    references: [userTable.id],
  }),
  nodes: many(node),
}))

export const nodeRelations = relations(node, ({ one }) => ({
  page: one(page, {
    fields: [node.pageId],
    references: [page.id],
  }),
}))
