import type { authClient } from '@/lib/auth-client'
import { createRouter } from '@tanstack/react-router'

import { CircleSpinner } from '@workspace/ui/components/spinner'

import { env } from '@/env'
import { queryClient } from '@/lib/query-client'
import { trpcClient } from '@/lib/trpc-client'
import { routeTree } from '@/routeTree.gen'

export interface RouterContext {
  queryClient: typeof queryClient
  trpcClient: typeof trpcClient
  authClient: typeof authClient
  getTitle?: () => string
}

// Remove trailing slash from base path if it's not just a slash
const basepath =
  env.PUBLIC_BASE_PATH.endsWith('/') && env.PUBLIC_BASE_PATH !== '/'
    ? env.PUBLIC_BASE_PATH.slice(0, -1)
    : env.PUBLIC_BASE_PATH

export function createAppRouter({ authClient }: Pick<RouterContext, 'authClient'>) {
  return createRouter({
    routeTree,
    context: {
      queryClient,
      trpcClient,
      authClient,
    } satisfies RouterContext,
    basepath: import.meta.env.PROD ? basepath : '/',
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Since we're using React Query, we don't want loader calls to ever be stale
    // This will ensure that the loader is always called when the route is preloaded or visited
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => (
      <div className="flex items-center justify-center">
        <CircleSpinner />
      </div>
    ),
  })
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
