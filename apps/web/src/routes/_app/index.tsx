import type * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { MoreVerticalIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@workspace/ui/components/item'
import { CircleSpinner } from '@workspace/ui/components/spinner'

import { authClient } from '@/lib/auth-client'
import { trpcClient } from '@/lib/trpc-client'
import { pageLinkOptions } from '@/routes/_app/-validations/app-link-options'

export const Route = createFileRoute('/_app/')({
  beforeLoad: async ({ context }) => {
    try {
      const { data: session } = await context.authClient.getSession()

      return {
        session,
      }
    } catch (e) {
      console.error(e)
      return {
        session: null,
      }
    }
  },
  loader: async ({ context }) => {
    // Don't prefetch if no user
    if (!context.session?.user) return

    // Prefetch pages data
    await context.queryClient.ensureQueryData(context.trpcClient.notes.all.queryOptions({ limit: 20, offset: 0 }))
  },
  component: HomeComponent,
})

function HomeComponent(): React.JSX.Element {
  const { data: session, isPending } = authClient.useSession()

  const pagesQuery = useQuery({
    ...trpcClient.notes.all.queryOptions({ limit: 20, offset: 0 }),
    enabled: !!session?.user, // Only fetch if user is authenticated
  })
  const pages = pagesQuery.data ?? []

  if (isPending || pagesQuery.isLoading) {
    return (
      <div className="flex items-center gap-2">
        <CircleSpinner /> Loading...
      </div>
    )
  }

  if (!session?.user) {
    return <div>Please log in</div>
  }

  if (pagesQuery.error) {
    return <div>Error: {pagesQuery.error.message}</div>
  }

  if (pages.length === 0) {
    return <p className="text-muted-foreground text-center">No pages found.</p>
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <h2 className="mb-4 text-2xl font-bold">Your Pages</h2>
      <div className="flex flex-col gap-4">
        {pages.map((page) => (
          <Item key={page.id} asChild variant="muted" className="border-border border">
            <Link {...pageLinkOptions(page.id)}>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{page.title}</ItemTitle>
                <ItemDescription>Updated: {page.updatedAt.toLocaleString()}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-lg" className="rounded-full p-6">
                      <MoreVerticalIcon className="size-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          console.log('Delete')
                        }}
                        className="text-destructive flex items-center gap-2"
                      >
                        <Trash2Icon className="text-destructive size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Link>
          </Item>
        ))}
        <Button variant="outline" size="lg" className="w-fit">
          Create New Page
        </Button>
      </div>
    </div>
  )
}
