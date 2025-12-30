import type { RouterContext } from '@/router'
import type * as React from 'react'
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'

import { Toaster } from '@workspace/ui/components/sonner'

import { NotFound } from '@/routes/-components/not-found'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: (_ctx) => ({
    meta: [
      {
        title: 'Notes Manager',
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://www.google.com/s2/favicons?domain=www.fortfel.com',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent(): React.JSX.Element {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster />
    </>
  )
}
