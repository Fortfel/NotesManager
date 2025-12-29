import type { AppRouter } from '@workspace/api/client'
import { createTanstackQueryTRPCClient, createTRPCOptionsProxy } from '@workspace/api/client'

import { env } from '@/env'
import { queryClient } from '@/lib/query-client'

export const trpcClient = createTRPCOptionsProxy<AppRouter>({
  client: createTanstackQueryTRPCClient({
    serverUrl: env.PUBLIC_SERVER_URL,
    apiPath: env.PUBLIC_SERVER_API_PATH,
    isDev: import.meta.env.DEV,
  }),
  queryClient,
})
