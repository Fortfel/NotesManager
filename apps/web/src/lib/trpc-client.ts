import { createTanstackQueryTRPCClient } from '@workspace/api/client'

import { env } from '@/env'

export const trpcClient = createTanstackQueryTRPCClient({
  serverUrl: env.PUBLIC_SERVER_URL,
  apiPath: env.PUBLIC_SERVER_API_PATH,
  isDev: import.meta.env.DEV,
})

export { TRPCProvider, useTRPC, useTRPCClient } from '@workspace/api/client'
