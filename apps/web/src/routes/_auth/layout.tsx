import { createFileRoute, Outlet, redirect, stripSearchParams, useLocation } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'

import { AuthFormStoreProvider } from '@/providers/auth-form-store-provider'
import { authSearchParamsDefaults, authSearchParamsSchema } from '@/routes/_auth/-validations/auth-link-options'

export const Route = createFileRoute('/_auth')({
  validateSearch: zodValidator(authSearchParamsSchema),
  search: {
    // Remove redirect search param from URL when it equals the default value.
    // This keeps the URL clean when routes use masking (which triggers the default).
    middlewares: [stripSearchParams(authSearchParamsDefaults)],
  },
  beforeLoad: async ({ context, search }) => {
    const { data: session } = await context.authClient.getSession()

    if (session?.user) {
      // Redirect if already authenticated
      throw redirect({ to: search.redirect })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const location = useLocation()

  return (
    <AuthFormStoreProvider key={location.pathname}>
      <Outlet />
    </AuthFormStoreProvider>
  )
}
