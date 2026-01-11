import crypto from 'node:crypto'
import { reset, seed } from 'drizzle-seed'

import { env } from '../../../../apps/fastify/src/env'
import { createDatabase } from '../client'
import * as schema from '../schema'
import { account as accountTable, user as userTable } from '../schemas/auth'
import { node as nodeTable, page as pageTable } from '../schemas/notes'
import { initUsersData, messages } from './initial-users-data'

const main = async (): Promise<void> => {
  const db = createDatabase({
    url: env.DATABASE_URL,
  })

  console.log('🌱 Starting database seeding...')

  try {
    // Reset database (optional - remove if you want to keep existing data)
    console.log('🗑️  Resetting database...')
    await reset(db, schema)

    // Seed users with pages and nodes using drizzle-seed's 'with' feature
    console.log('🌱 Seeding users with pages...')
    await seed(db, {
      user: userTable,
      account: accountTable,
      page: pageTable,
      node: nodeTable,
    }).refine((funcs) => ({
      user: {
        count: initUsersData.length,
        columns: {
          id: funcs.uuid(),
          name: funcs.fullName(),
          email: funcs.email(),
          emailVerified: funcs.default({ defaultValue: false }),
          image: funcs.valuesFromArray({
            values: initUsersData.map((user) => user.image),
          }),
        },
        with: {
          account: 1,
          page: [
            {
              weight: 1,
              count: [1, 2, 3],
            },
          ],
        },
      },
      account: {
        columns: {
          id: funcs.uuid(),
          accountId: funcs.uuid(), // This will be overridden by the user relationship
          providerId: funcs.valuesFromArray({ values: ['credential'] }),
          password: funcs.valuesFromArray({
            values: [
              '50a7cca404e858850b673d68495596f3:5cf3da3a312c0d801cf09dbbfcb2eb14bb578d02b31d8c7ec08a7f4bc86212d87c33b1549dc4610d19c2405db9a40d571ba7471da912efa847e8dadbb2c1fa02',
            ], // hashed version. non-hashed is "securePassword"
          }),
        },
      },
      page: {
        columns: {
          id: funcs.uuid(),
          slug: funcs.uuid(),
          title: funcs.loremIpsum({ sentencesCount: 1 }),
          cover: funcs.default({ defaultValue: '' }),
        },
        with: {
          node: [
            {
              weight: 1,
              count: [2, 5],
            },
          ],
        },
      },
      node: {
        columns: {
          id: funcs.uuid(),
          type: funcs.valuesFromArray({ values: ['text', 'heading1', 'heading2'] }),
          value: funcs.valuesFromArray({ values: messages }),
        },
      },
    }))

    // Add demo account with showcase pages
    // Keep in sync with DEMO_USER in @workspace/api/config
    const DEMO_USER_EMAIL = 'demo@example.com'
    const DEMO_USER_HASHED_PASSWORD =
      '50a7cca404e858850b673d68495596f3:5cf3da3a312c0d801cf09dbbfcb2eb14bb578d02b31d8c7ec08a7f4bc86212d87c33b1549dc4610d19c2405db9a40d571ba7471da912efa847e8dadbb2c1fa02' // securePassword

    console.log('🔧 Adding demo account...')
    try {
      const testUserId = crypto.randomUUID()
      const testAccountId = crypto.randomUUID()

      // Insert user directly
      await db.insert(userTable).values({
        id: testUserId,
        name: 'Demo User',
        email: DEMO_USER_EMAIL,
        emailVerified: false,
        image: initUsersData[0]?.image || '',
      })

      // Insert account with hashed password
      await db.insert(accountTable).values({
        id: testAccountId,
        userId: testUserId,
        accountId: testUserId,
        providerId: 'credential',
        password: DEMO_USER_HASHED_PASSWORD,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Protected page slugs - keep in sync with DEMO_USER in @workspace/api/config
      const PROTECTED_PAGE_SLUGS = ['welcome-to-notes-manager', 'getting-started'] as const
      const welcomePageId = crypto.randomUUID()
      const gettingStartedPageId = crypto.randomUUID()

      // Page 1: Welcome to Notes Manager (protected)
      await db.insert(pageTable).values({
        id: welcomePageId,
        slug: PROTECTED_PAGE_SLUGS[0],
        title: 'Welcome to Notes Manager',
        cover: '',
        userId: testUserId,
      })

      // Page 2: Getting Started (protected, with link to page 1)
      await db.insert(pageTable).values({
        id: gettingStartedPageId,
        slug: PROTECTED_PAGE_SLUGS[1],
        title: 'Getting Started',
        cover: '',
        userId: testUserId,
      })

      // Nodes for Welcome page
      const welcomeNodes = [
        { type: 'heading1' as const, value: 'Welcome to Notes Manager!' },
        {
          type: 'text' as const,
          value:
            'This is a simple note-taking application built with modern web technologies. Feel free to explore and create your own pages!',
        },
        { type: 'heading2' as const, value: 'Features' },
        { type: 'list' as const, value: 'Create and organize pages with rich content' },
        { type: 'list' as const, value: 'Support for headings, text, and lists' },
        { type: 'list' as const, value: 'Link between pages using the page node type' },
        { type: 'list' as const, value: 'Auto-saving as you type' },
        { type: 'list' as const, value: 'Clean and modern interface' },
        { type: 'heading2' as const, value: 'Demo Account Limitations' },
        { type: 'text' as const, value: 'As a demo user, you can:' },
        { type: 'list' as const, value: 'Create up to 10 pages total' },
        { type: 'list' as const, value: 'Edit and delete pages you create' },
        {
          type: 'text' as const,
          value: 'Note: The first two example pages (this one and "Getting Started") cannot be modified or deleted.',
        },
        { type: 'heading2' as const, value: 'Get Started' },
        {
          type: 'text' as const,
          value: 'Check out the Getting Started guide to learn how to use the app (double click):',
        },
        { type: 'page' as const, value: gettingStartedPageId },
      ]

      for (const [i, nodeData] of welcomeNodes.entries()) {
        await db.insert(nodeTable).values({
          id: crypto.randomUUID(),
          type: nodeData.type,
          value: nodeData.value,
          order: i,
          pageId: welcomePageId,
        })
      }

      // Nodes for Getting Started page
      const gettingStartedNodes = [
        { type: 'heading1' as const, value: 'Getting Started Guide' },
        { type: 'text' as const, value: 'This guide will help you get started with Notes Manager.' },
        { type: 'heading2' as const, value: 'Creating a New Page' },
        { type: 'list' as const, value: 'Click the "New Page" button in the sidebar' },
        { type: 'list' as const, value: 'Give your page a title' },
        { type: 'list' as const, value: 'Start adding content!' },
        { type: 'heading2' as const, value: 'Adding Content' },
        { type: 'text' as const, value: 'You can add different types of content blocks:' },
        { type: 'heading3' as const, value: 'Text Blocks' },
        { type: 'text' as const, value: 'Regular paragraphs for your notes and thoughts.' },
        { type: 'heading3' as const, value: 'Headings' },
        { type: 'text' as const, value: 'Use H1, H2, and H3 headings to organize your content hierarchically.' },
        { type: 'heading3' as const, value: 'Lists' },
        { type: 'text' as const, value: 'Create bullet lists to organize information:' },
        { type: 'list' as const, value: 'First item' },
        { type: 'list' as const, value: 'Second item' },
        { type: 'list' as const, value: 'Third item' },
        { type: 'heading3' as const, value: 'Page Links' },
        {
          type: 'text' as const,
          value: 'Link to other pages in your workspace. Here is a link back to the welcome page (double click):',
        },
        { type: 'page' as const, value: welcomePageId },
        { type: 'heading2' as const, value: 'Tips' },
        { type: 'list' as const, value: 'Your changes are saved automatically' },
        { type: 'list' as const, value: 'Use headings to structure long documents' },
        { type: 'list' as const, value: 'Link related pages together for easy navigation' },
        { type: 'text' as const, value: 'Happy note-taking!' },
      ]

      for (const [i, nodeData] of gettingStartedNodes.entries()) {
        await db.insert(nodeTable).values({
          id: crypto.randomUUID(),
          type: nodeData.type,
          value: nodeData.value,
          order: i,
          pageId: gettingStartedPageId,
        })
      }

      console.log('✅ Demo account created successfully')
    } catch (error) {
      console.log('⚠️  Demo account might already exist or creation failed:', error)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${initUsersData.length.toString()} users created`)
    console.log(`   - ${initUsersData.length.toString()} accounts created`)
    console.log('   - 1 test account (demo@example.com / secret)')
    console.log('   - pages and nodes created')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await db.$client.end()
    console.log('🔌 Database connection closed')
  }
}

void main()
