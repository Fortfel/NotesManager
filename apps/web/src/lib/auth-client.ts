import { createAuthClient } from '@workspace/auth/client'

import { env } from '@/env'

export const authClient = createAuthClient({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
  apiBasePath: env.PUBLIC_SERVER_API_PATH,
})

export type AuthSession = typeof authClient.$Infer.Session
// export type AuthSession = ReturnType<typeof createAuthClient>['$Infer']['Session'] | null
