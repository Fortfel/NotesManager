import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.css'

import type { QueryClient } from '@tanstack/react-query'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { ThemeProvider } from '@workspace/ui/components/theme-provider'

import { config } from '@/config'
import { authClient } from '@/lib/auth-client'
import { createQueryClient } from '@/lib/query-client'
import { trpcClient, TRPCProvider } from '@/lib/trpc-client'
import { createAppRouter } from '@/router'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found.")
}

let browserQueryClient: QueryClient | undefined = undefined
function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    browserQueryClient ??= createQueryClient()
    return browserQueryClient
  }
}

const queryClient = getQueryClient()

const router = createAppRouter({ queryClient, trpcClient, authClient })

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme={config.themeDefault}
      themes={config.themes.filter((theme) => theme.key !== 'system').map((theme) => theme.key)}
      storageKey={config.themeStorageKey}
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <RouterProvider router={router} />

          <TanStackDevtools
            plugins={[
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel router={router} />,
              },
              {
                name: 'Tanstack Form',
                render: <FormDevtools />,
              },
            ]}
          />
        </TRPCProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
