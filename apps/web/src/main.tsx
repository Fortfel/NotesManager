import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.css'

import { TanStackDevtools } from '@tanstack/react-devtools'
import { FormDevtools } from '@tanstack/react-form-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { ThemeProvider } from '@workspace/ui/components/theme-provider'

import { config } from '@/config'
import { authClient } from '@/lib/auth-client'
import { queryClient } from '@/lib/query-client'
import { createAppRouter } from '@/router'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found.")
}

const router = createAppRouter({ authClient })

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
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
