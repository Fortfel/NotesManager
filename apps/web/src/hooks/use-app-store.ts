import type { AppStoreState } from '@/providers/app-store-provider'
import * as React from 'react'
import { produce } from 'immer'

import { AppStoreContext } from '@/providers/app-store-provider'

type Page = AppStoreState['pages'][number]
type Node = Page['nodes'][number]
type NodeType = Node['type']

const useAppStore = () => {
  const store = React.useContext(AppStoreContext)
  if (!store) {
    throw new Error('useAppStore must be used within a AppStoreProvider')
  }

  return React.useMemo(
    () => ({
      store,

      // Pages management
      setPages: (pages: Array<Page>) => {
        store.setState((s) =>
          produce(s, (draft) => {
            draft.pages = pages
          }),
        )
      },

      addPage: (page: Page) => {
        store.setState((s) =>
          produce(s, (draft) => {
            draft.pages.push(page)
          }),
        )
      },

      removePage: (pageId: string) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const index = draft.pages.findIndex((p) => p.id === pageId)
            if (index !== -1) draft.pages.splice(index, 1)
          }),
        )
      },

      updatePage: (pageId: string, updates: Partial<Omit<Page, 'id' | 'nodes'>>) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page) Object.assign(page, updates)
          }),
        )
      },

      // Node management for a specific page
      addNode: (pageId: string, node: Node, index?: number) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (!page) return
            if (index === undefined) {
              page.nodes.push(node)
            } else {
              page.nodes.splice(index, 0, node)
            }
          }),
        )
      },

      removeNode: (pageId: string, nodeId: string) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (!page) return
            const index = page.nodes.findIndex((n) => n.id === nodeId)
            if (index !== -1) page.nodes.splice(index, 1)
          }),
        )
      },

      removeNodeByIndex: (pageId: string, nodeIndex: number) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page) page.nodes.splice(nodeIndex, 1)
          }),
        )
      },

      updateNode: (pageId: string, nodeId: string, updates: Partial<Omit<Node, 'id'>>) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (!page) return
            const node = page.nodes.find((n) => n.id === nodeId)
            if (node) Object.assign(node, updates)
          }),
        )
      },

      changeNodeValue: (pageId: string, nodeIndex: number, value: string) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page?.nodes[nodeIndex]) {
              page.nodes[nodeIndex].value = value
            }
          }),
        )
      },

      changeNodeType: (pageId: string, nodeIndex: number, type: NodeType) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page?.nodes[nodeIndex]) {
              page.nodes[nodeIndex].type = type
              page.nodes[nodeIndex].value = ''
            }
          }),
        )
      },

      setNodes: (pageId: string, nodes: Array<Node>) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page) page.nodes = nodes
          }),
        )
      },

      reorderNodes: (pageId: string, nodeId1: string, nodeId2: string) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (!page) return

            const index1 = page.nodes.findIndex((n) => n.id === nodeId1)
            const index2 = page.nodes.findIndex((n) => n.id === nodeId2)
            if (index1 === -1 || index2 === -1) return

            const [removed] = page.nodes.splice(index1, 1)
            if (removed) page.nodes.splice(index2, 0, removed)
          }),
        )
      },

      setTitle: (pageId: string, title: string) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page) page.title = title
          }),
        )
      },

      setCover: (pageId: string, cover: string) => {
        store.setState((s) =>
          produce(s, (draft) => {
            const page = draft.pages.find((p) => p.id === pageId)
            if (page) page.cover = cover
          }),
        )
      },

      // Getters
      getPage: (pageId: string) => {
        return store.state.pages.find((p) => p.id === pageId)
      },

      getPageBySlug: (slug: string) => {
        return store.state.pages.find((p) => p.slug === slug)
      },
    }),
    [store],
  )
}

export { useAppStore }
