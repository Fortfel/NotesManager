import * as React from 'react'
import { createFileRoute, Outlet, stripSearchParams, useNavigate } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'
import { appSearchParamsDefaults, appSearchParamsSchema } from '@/routes/_app/-validations/app-link-options'
import { AppNavbar } from '@/routes/-components/layout/nav/app-navbar'

export const Route = createFileRoute('/_app')({
  validateSearch: appSearchParamsSchema,
  search: {
    // Remove refetchSession from URL if it equals false to keep the URL clean
    middlewares: [stripSearchParams(appSearchParamsDefaults)],
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { refetchSession: shouldRefetch } = Route.useSearch()
  const navigate = useNavigate()
  const session = authClient.useSession()

  const navbarHeight = '64px'

  /**
   * Refetches session data after OAuth login
   *
   * Why this is needed:
   * - When linking accounts (e.g., email → Google OAuth), Better Auth updates the database
   *   with new user info (name, image) due to `overrideUserInfoOnSignIn: true` config
   * - However, the client-side session cache is stale and shows old data
   * - We need to bypass the cookie cache to fetch fresh data from the server
   *
   * How it works:
   * 1. OAuth redirect includes `?refetchSession=true` in callbackURL
   * 2. This effect triggers and calls getSession with `disableCookieCache: true`
   * 3. Fresh session data is fetched from server, updating the UI
   * 4. Navigate replaces URL, removing the `refetchSession` param
   */
  const onRefetchSession = React.useEffectEvent(async () => {
    await authClient
      .getSession({
        query: {
          disableCookieCache: true,
        },
      })
      .then(() => {
        // Trigger useSession hooks to refetch
        session.refetch()

        void navigate({
          to: '.',
          search: (prev) => ({
            ...prev,
            refetchSession: false,
          }),
          replace: true,
        })
      })
  })

  React.useEffect(() => {
    if (shouldRefetch) {
      void onRefetchSession()
    }
  }, [shouldRefetch])

  return (
    <div className="bg-background text-foreground overflow-x-hidden font-sans antialiased">
      <AppNavbar height={navbarHeight} />

      <main
        className={'mx-auto min-h-dvh max-w-7xl px-4 py-6 pt-[calc(var(--nav-height)+1.5rem)] sm:px-6 lg:px-8'}
        style={{ '--nav-height': navbarHeight } as React.CSSProperties}
      >
        <Outlet />
      </main>
    </div>
  )
}
