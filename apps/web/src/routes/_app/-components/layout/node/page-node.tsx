import type { NodeOutput } from '@/utils/types'
import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { Popover, PopoverAnchor, PopoverContent } from '@workspace/ui/components/popover'
import { cn } from '@workspace/ui/lib/utils'

import { trpcClient } from '@/lib/trpc-client'
import { pageLinkOptions } from '@/routes/_app/-validations/app-link-options'

const isValidUUID = (value: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

type PageNodeProps = {
  node: NodeOutput
  updateNodeValue: (value: string, index: number) => void
  addNode: (value: string, index: number) => void
  removeNode: (index: number) => void
  updateFocusedIndex: (index: number) => void
  isFocused: boolean
  index: number
}

export const PageNode = ({
  node,
  addNode,
  removeNode,
  updateFocusedIndex,
  updateNodeValue,
  isFocused,
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & PageNodeProps) => {
  const navigate = useNavigate()
  const { pageId: currentPageId } = useParams({ strict: false })
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const commandInputRef = React.useRef<HTMLInputElement>(null)

  const allPagesQuery = useQuery(trpcClient.notes.all.queryOptions({ limit: 100 }))

  // Filter out current page from selection
  const availablePages = React.useMemo(
    () => allPagesQuery.data?.filter((page) => page.id !== currentPageId) ?? [],
    [allPagesQuery.data, currentPageId],
  )

  // Fetch page title using the pageId stored in node.value
  const pageQuery = useQuery({
    ...trpcClient.notes.byId.queryOptions({ id: node.value }),
    enabled: node.type === 'page' && !!node.value && isValidUUID(node.value),
  })

  const pageTitle = pageQuery.data?.title || 'Select a page...'
  const hasValidPageId = !!node.value && isValidUUID(node.value)

  const shouldShowPageSelector = !hasValidPageId && isFocused

  React.useEffect(() => {
    if (shouldShowPageSelector) {
      setTimeout(() => commandInputRef.current?.focus(), 0)
    } else if (isFocused && nodeRef.current) {
      nodeRef.current.focus()
    }
  }, [isFocused, shouldShowPageSelector])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      removeNode(index)
      updateFocusedIndex(index - 1)
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      addNode('', index)
      updateFocusedIndex(index + 1)
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      removeNode(index)
      updateFocusedIndex(index - 1)
    }
  }

  const handleSelectPage = (pageId: string) => {
    updateNodeValue(pageId, index)
    addNode('', index + 1)
    updateFocusedIndex(index + 1)
  }

  const handleCommandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      removeNode(index)
      updateFocusedIndex(index - 1)
    }
  }

  const handleClick = () => {
    updateFocusedIndex(index)
  }

  const navigateToPage = () => {
    if (hasValidPageId) {
      void navigate({ ...pageLinkOptions(node.value) })
    }
  }

  return (
    <div data-slot="page-node" className={cn('relative', className)} {...props}>
      <Popover open={shouldShowPageSelector}>
        <PopoverAnchor asChild>
          <div
            ref={nodeRef}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onDoubleClick={navigateToPage}
            tabIndex={0}
            role="button"
            aria-label={`Page link: ${pageTitle}`}
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded px-2 py-1 outline-none',
              'hover:bg-accent/50 transition-colors',
              isFocused && 'ring-primary ring-2',
              !hasValidPageId && 'text-muted-foreground italic',
            )}
          >
            <span className="text-lg">📄</span>
            <span className="text-sm">{pageTitle}</span>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className={cn('w-[300px] p-0')}
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            commandInputRef.current?.focus()
          }}
        >
          <Command>
            <CommandInput ref={commandInputRef} onKeyDown={handleCommandKeyDown} placeholder="Search pages..." />
            <CommandList>
              <CommandEmpty>No pages found.</CommandEmpty>
              <CommandGroup heading="Link to page">
                {availablePages.map((page) => (
                  <CommandItem key={page.id} value={page.title} onSelect={() => handleSelectPage(page.id)}>
                    <span className="mr-2">📄</span>
                    {page.title || 'Untitled'}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
