import { createFileRoute, Navigate } from '@tanstack/react-router'

import { loginLinkOptions } from '@/routes/_auth/-validations/auth-link-options'

export const Route = createFileRoute('/_auth/password/')({
  component: RouteComponent,
})

function RouteComponent() {
  // In case someone enter password/ route, redirect to login
  return <Navigate {...loginLinkOptions} />
}
