import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected')({
  beforeLoad: async ({ context, location }) => {
    let session

    try {
      const result = await context.authClient.getSession()
      session = result.data
    } catch (error) {
      console.error('Failed to get session:', error)
      throw redirect({ to: '/login' })
    }

    if (!session?.user) {
      throw redirect({
        to: '/login',
        search: {
          // @see https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes#redirecting
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
        mask: {
          // Search param will be stripped by stripSearchParams middleware in /_auth route
          to: '/login',
        },
      })
    }
  },
  component: Layout,
})

function Layout() {
  return <Outlet />
}
