import type { DragEndEvent } from '@dnd-kit/core'
import * as React from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, notFound, rootRouteId } from '@tanstack/react-router'
import { ArrowLeft, Save } from 'lucide-react'
import { useImmer } from 'use-immer'

import { Button } from '@workspace/ui/components/button'

import { useFocusedNodeIndex } from '@/hooks/use-focused-node-index'
import { authClient } from '@/lib/auth-client'
import { trpcClient } from '@/lib/trpc-client'
import { Cover } from '@/routes/_app/-components/layout/cover'
import { NodeContainer } from '@/routes/_app/-components/layout/node/node-container'
import { NodeTypeSwitcher } from '@/routes/_app/-components/layout/node/node-type-switcher'
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
  const { data: session } = authClient.useSession()

  const isTestUser = session?.user.email === 'demo@example.com'

  const queryClient = useQueryClient()
  const pageQuery = useQuery(trpcClient.notes.byId.queryOptions({ id: pageId }))
  const updatePageMutation = useMutation({
    ...trpcClient.notes.update.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [['notes', 'byId']] })
    },
  })
  const updateNodesMutation = useMutation({
    ...trpcClient.notes.updateNodes.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [['notes', 'byId']] })
    },
  })

  const commandPanelOpenRef = React.useRef(false)

  // Local state for editing with useImmer
  const [localPage, setLocalPage] = useImmer<typeof pageQuery.data>(undefined)

  const cover = localPage?.cover || `${import.meta.env.BASE_URL}placeholder.png`
  const title = localPage?.title ?? ''
  const nodes = localPage?.nodes ?? []

  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex({
    nodes,
    shouldIgnoreKeys: () => commandPanelOpenRef.current,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

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

  // Handler to add a new node
  const handleAddNode = React.useCallback(
    (node: Pick<(typeof nodes)[number], 'value'> & Partial<Pick<(typeof nodes)[number], 'type'>>, index?: number) => {
      setLocalPage((draft) => {
        if (!draft) return

        const newNode = {
          ...node,
          id: crypto.randomUUID(),
          pageId: pageId,
          type: node.type || 'text',
          value: node.value,
          order: index ?? 0,
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

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (!over || active.id === over.id) return

      setLocalPage((draft) => {
        if (!draft) return

        const oldIndex = draft.nodes.findIndex((node) => node.id === active.id)
        const newIndex = draft.nodes.findIndex((node) => node.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          draft.nodes = arrayMove(draft.nodes, oldIndex, newIndex)
        }
      })
    },
    [setLocalPage],
  )

  const handleUpdateNodeType = React.useCallback(
    (type: (typeof nodes)[number]['type'], index: number) => {
      setLocalPage((draft) => {
        if (draft?.nodes[index]) {
          draft.nodes[index].type = type
        }
      })
    },
    [setLocalPage],
  )

  // Destructure the mutate functions
  const { mutate: updatePage } = updatePageMutation
  const { mutate: updateNodes } = updateNodesMutation

  const handleSave = React.useCallback(() => {
    if (!localPage) return
    if (isTestUser) {
      alert('You are not allowed to save pages as a test user')
      return
    }

    // Update page metadata
    updatePage({
      id: pageId,
      title: localPage.title,
      slug: localPage.slug,
      cover: localPage.cover || '',
    })

    // Update nodes
    updateNodes({
      pageId,
      nodes: localPage.nodes.map((node, index) => ({
        id: node.id,
        type: node.type,
        value: node.value,
        pageId: node.pageId,
        order: index,
      })),
    })
  }, [localPage, pageId, updatePage, updateNodes, isTestUser])

  const isSaving = updatePageMutation.isPending || updateNodesMutation.isPending

  if (pageQuery.isLoading) return <div>Loading...</div>
  if (pageQuery.isError) return <div>Error: {pageQuery.error.message}</div>
  if (!localPage) return <div>Page not found</div>

  return (
    <div>
      <Cover filePath={cover} onCoverChange={handleCoverChange} />
      <Title title={title} onTitleChange={handleTitleChange} onEnterKeyDown={handleTitleEnter} className="mt-6" />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={nodes}>
          {nodes.map((node, index) => (
            <NodeContainer key={node.id} id={node.id}>
              <NodeTypeSwitcher
                node={node}
                updateNodeValue={handleUpdateNodeValue}
                updateNodeType={handleUpdateNodeType}
                addNode={(value, index) => handleAddNode({ value }, index)}
                removeNode={handleRemoveNode}
                updateFocusedIndex={setFocusedNodeIndex}
                isFocused={focusedNodeIndex === index}
                index={index}
                commandPanelOpenRef={commandPanelOpenRef}
              />
            </NodeContainer>
          ))}
        </SortableContext>
        <DragOverlay />
      </DndContext>
      {/* Spacer */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div role="button" tabIndex={0} onClick={handleSpacerClick}>
        {nodes.length === 0 && <p>Click to create the first paragraph.</p>}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-2">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="size-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
