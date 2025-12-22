import { reset, seed } from 'drizzle-seed'

import { env } from '../../../../apps/fastify/src/env'
import { initAuth } from '../../../auth/src/server'
import { createDatabase } from '../client'
import * as schema from '../schema'
import { account as accountTable, user as userTable } from '../schemas/auth'
import { post as postTable } from '../schemas/posts'
import { initUsersData, messages } from './initial-users-data'

const main = async (): Promise<void> => {
  const db = createDatabase({
    url: env.DATABASE_URL,
  })

  // Initialize auth instance (same as in Fastify server)
  const auth = initAuth({
    db,
    webUrl: env.CLIENT_URL,
    serverUrl: env.SERVER_URL,
    apiPath: env.SERVER_API_PATH,
    authSecret: env.AUTH_SECRET,
    googleClientId: env.AUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    discordClientId: env.AUTH_DISCORD_CLIENT_ID,
    discordClientSecret: env.AUTH_DISCORD_CLIENT_SECRET,
  })

  console.log('🌱 Starting database seeding...')

  try {
    // Reset database (optional - remove if you want to keep existing data)
    console.log('🗑️  Resetting database...')
    await reset(db, schema)

    // Seed users with posts using drizzle-seed's 'with' feature
    console.log('🌱 Seeding users with posts...')
    await seed(db, {
      user: userTable,
      account: accountTable,
      post: postTable,
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
          post: [
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
              '035f373274a799f11bae5745fbeefc73:214c6c33b8dcb6ed279c35b8c8ad4ee2c5dcd0798a434616ab124f0c25ee1707b550ce0817154def9c3279bfac566d2d08c635766d41004a502ee745a644c923',
            ], // hashed version. non-hashed is "securePassword"
          }),
        },
      },
      post: {
        columns: {
          title: funcs.loremIpsum({ sentencesCount: 1 }),
          content: funcs.valuesFromArray({ values: messages }),
        },
      },
    }))

    // Add test account using Better Auth's signUpEmail
    console.log('🔧 Adding test account...')
    try {
      const testUser = await auth.api.signUpEmail({
        body: {
          name: 'Demo User',
          email: 'demo@example.com',
          password: 'secretPassword',
          image: initUsersData[0]?.image,
        },
      })

      // Add a post for the test user
      await db.insert(postTable).values({
        title: 'Welcome to my test account',
        content: 'This is a demo post from the test account.',
        userId: testUser.user.id,
      })

      console.log('✅ Test account created successfully')
    } catch (error) {
      console.log('⚠️  Test account might already exist or creation failed:', error)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${initUsersData.length.toString()} users created`)
    console.log(`   - ${initUsersData.length.toString()} accounts created`)
    console.log('   - 1 test account (demo@example.com / secret)')
    console.log('   - ~101 posts created')
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  } finally {
    await db.$client.end()
    console.log('🔌 Database connection closed')
  }
}

void main()
