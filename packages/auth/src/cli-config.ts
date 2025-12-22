import { betterAuth } from 'better-auth'

import { getBaseOptions } from '@workspace/auth/server'
import { createDatabase } from '@workspace/db/client'

/**
 * @internal
 *
 * This export is needed strictly for the CLI to work with
 *     pnpm auth:schema:generate
 *
 * It should not be imported or used for any other purpose.
 *
 * The documentation for better-auth CLI can be found here:
 * - https://www.better-auth.com/docs/concepts/cli
 */
export const auth = betterAuth(getBaseOptions(createDatabase({ url: 'mysql://localhost:3306/mock' })))
