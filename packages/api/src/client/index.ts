import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'
import urlJoin from 'url-join'

import type { AppRouter } from '../server'

export interface TRPCClientOptions {
  serverUrl: string
  apiPath: string
  isDev: boolean
}

export const createTanstackQueryTRPCClient = ({ serverUrl, apiPath, isDev }: TRPCClientOptions) => {
  return createTRPCClient<AppRouter>({
    links: [
      // Enable logging in dev or on errors
      loggerLink({
        enabled: (op) => isDev || (op.direction === 'down' && op.result instanceof Error),
      }),
      httpBatchLink({
        url: urlJoin(serverUrl, apiPath),
        fetch(url: string | Request | URL, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
        transformer: SuperJSON,
      }),
    ],
  })
}

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>()

export type { AppRouter, RouterInputs, RouterOutputs } from '../server'
