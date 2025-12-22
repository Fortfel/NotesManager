import { relations } from 'drizzle-orm'
import { mysqlTable, timestamp } from 'drizzle-orm/mysql-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { user as userTable } from './auth'

const timestamps = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow().onUpdateNow(),
}

export const post = mysqlTable('post', (t) => ({
  id: t.serial().primaryKey(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  ...timestamps,
  userId: t
    .varchar({ length: 36 })
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
}))

export const postInsertSchema = createInsertSchema(post, {
  userId: z.uuid(),
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const userRelations = relations(userTable, ({ many }) => ({
  posts: many(post),
}))

export const postRelations = relations(post, ({ one }) => ({
  user: one(userTable, {
    fields: [post.userId],
    references: [userTable.id],
  }),
}))
