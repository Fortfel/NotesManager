import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, rootRouteId } from '@tanstack/react-router'
import { nanoid } from 'nanoid'
import { useImmer } from 'use-immer'

import { useFocusedNodeIndex } from '@/hooks/use-focused-node-index'
import { trpcClient } from '@/lib/trpc-client'
import { Cover } from '@/routes/_app/-components/layout/cover'
import { BasicNode } from '@/routes/_app/-components/layout/node/basic-node'
import { Title } from '@/routes/_app/-components/layout/title'
import { appParamsSchema } from '@/routes/_app/-validations/app-link-options'

export const Route = createFileRoute('/_app/_protected/$pageId')({
  loader: async ({ context, params }) => {
    const result = appParamsSchema.safeParse(params)
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound({
        routeId: rootRouteId,
      })
    }

    await context.queryClient.ensureQueryData(context.trpcClient.notes.byId.queryOptions({ id: params.pageId }))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { pageId } = Route.useParams()
  const pageQuery = useQuery(trpcClient.notes.byId.queryOptions({ id: pageId }))

  // Local state for editing with useImmer
  const [localPage, setLocalPage] = useImmer<typeof pageQuery.data>(undefined)

  const cover = localPage?.cover || `${import.meta.env.BASE_URL}placeholder.png`
  const title = localPage?.title ?? ''
  const nodes = localPage?.nodes ?? []

  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex({ nodes })

  // Update local page state when query data changes
  React.useEffect(() => {
    setLocalPage(pageQuery.data)
  }, [pageQuery.data, setLocalPage])

  // Handler to update node value
  const handleUpdateNodeValue = React.useCallback(
    (value: string, index: number) => {
      setLocalPage((draft) => {
        if (draft?.nodes[index]) {
          draft.nodes[index].value = value
        }
      })
    },
    [setLocalPage],
  )

  // Handler to update node by ID
  const handleUpdateNodeById = React.useCallback(
    (id: string, value: string) => {
      setLocalPage((draft) => {
        if (!draft) return
        const node = draft.nodes.find((n) => n.id === id)
        if (node) {
          node.value = value
        }
      })
    },
    [setLocalPage],
  )

  // Handler to add a new node
  const handleAddNode = React.useCallback(
    (node: Pick<(typeof nodes)[number], 'value'> & Partial<Pick<(typeof nodes)[number], 'type'>>, index?: number) => {
      setLocalPage((draft) => {
        if (!draft) return

        const newNode = {
          ...node,
          id: nanoid(),
          pageId: pageId,
          type: node.type || 'text',
          value: node.value,
        } satisfies (typeof nodes)[number]

        if (index !== undefined && index >= 0) {
          // Insert at specific index
          draft.nodes.splice(index + 1, 0, newNode)
        } else {
          // Add to the end
          draft.nodes.push(newNode)
        }
      })
    },
    [setLocalPage, pageId],
  )

  // Handler to remove a node
  const handleRemoveNode = React.useCallback(
    (index: number) => {
      setLocalPage((draft) => {
        if (draft?.nodes[index]) {
          draft.nodes.splice(index, 1)
        }
      })
    },
    [setLocalPage],
  )

  // Handler to remove node by ID
  const handleRemoveNodeById = React.useCallback(
    (id: string) => {
      setLocalPage((draft) => {
        if (!draft) return
        const nodeIndex = draft.nodes.findIndex((n) => n.id === id)
        if (nodeIndex !== -1) {
          draft.nodes.splice(nodeIndex, 1)
        }
      })
    },
    [setLocalPage],
  )

  // Handler to update cover
  const handleCoverChange = React.useCallback(
    (filePath: string) => {
      setLocalPage((draft) => {
        if (draft) {
          draft.cover = filePath
        }
      })
    },
    [setLocalPage],
  )

  // Handler to update title
  const handleTitleChange = React.useCallback(
    (newTitle: string) => {
      setLocalPage((draft) => {
        if (draft) {
          draft.title = newTitle
        }
      })
    },
    [setLocalPage],
  )

  // Handler for when Enter is pressed in title (add first node)
  const handleTitleEnter = React.useCallback(() => {
    handleAddNode({ type: 'text', value: '' }, -1)
    setFocusedNodeIndex(0)
  }, [handleAddNode, setFocusedNodeIndex])

  const handleSpacerClick = React.useCallback(() => {
    if (nodes.length === 0) {
      handleAddNode({ type: 'text', value: '' })
      setFocusedNodeIndex(0)
    }
  }, [nodes.length, handleAddNode, setFocusedNodeIndex])

  if (pageQuery.isLoading) return <div>Loading...</div>
  if (pageQuery.isError) return <div>Error: {pageQuery.error.message}</div>
  if (!localPage) return <div>Page not found</div>

  return (
    <div>
      <Cover filePath={cover} onCoverChange={handleCoverChange} />
      <Title title={title} onTitleChange={handleTitleChange} onEnterKeyDown={() => console.log('Add node')} />
      {nodes.map((node, index) => (
        <BasicNode
          key={node.id}
          node={node}
          updateNodeValue={handleUpdateNodeValue}
          addNode={(value, index) => handleAddNode({ value }, index)}
          removeNode={handleRemoveNode}
          updateFocusedIndex={setFocusedNodeIndex}
          isFocused={focusedNodeIndex === index}
          index={index}
        />
      ))}
      {/* Spacer */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div role="button" tabIndex={0} onClick={handleSpacerClick}>
        {nodes.length === 0 && <p>Click to create the first paragraph.</p>}
      </div>
    </div>
  )
}
