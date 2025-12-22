import type { MySql2Database } from 'drizzle-orm/mysql2'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

import * as schema from './schema'

type DatabaseConfig = {
  url: string
  poolMax?: number
}

/**
 * Creates a database connection with connection pooling
 *
 * @param config - Database configuration object
 * @returns Configured Drizzle database instance
 */
export const createDatabase = (config: DatabaseConfig): MySql2Database<typeof schema> & { $client: mysql.Pool } => {
  return drizzle({
    client: mysql.createPool({
      uri: config.url,
      connectionLimit: config.poolMax ?? 10,
    }),
    schema,
    casing: 'snake_case', // Maps camelCase to snake_case
    mode: 'default',
  })
}

export type DatabaseInstance = ReturnType<typeof createDatabase>
