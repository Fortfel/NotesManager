import type { NodeOutput } from '@/utils/types'

import { BasicNode } from '@/routes/_app/-components/layout/node/basic-node'
import { PageNode } from '@/routes/_app/-components/layout/node/page-node'

type NodeTypeSwitcherProps = {
  node: NodeOutput
  updateNodeValue: (value: string, index: number) => void
  updateNodeType?: (type: NodeOutput['type'], index: number) => void
  addNode: (value: string, index: number) => void
  removeNode: (index: number) => void
  updateFocusedIndex: (index: number) => void
  isFocused: boolean
  index: number
  commandPanelOpenRef: React.RefObject<boolean>
}

const TEXT_NODE_TYPES = new Set<NodeOutput['type']>(['text', 'list', 'heading1', 'heading2', 'heading3'])

export const NodeTypeSwitcher = ({
  node,
  updateNodeValue,
  updateNodeType,
  addNode,
  removeNode,
  isFocused,
  index,
  updateFocusedIndex,
  commandPanelOpenRef,
}: NodeTypeSwitcherProps) => {
  if (TEXT_NODE_TYPES.has(node.type)) {
    return (
      <BasicNode
        node={node}
        index={index}
        isFocused={isFocused}
        updateFocusedIndex={updateFocusedIndex}
        updateNodeValue={updateNodeValue}
        updateNodeType={updateNodeType}
        addNode={addNode}
        removeNode={removeNode}
        commandPanelOpenRef={commandPanelOpenRef}
      />
    )
  }

  if (node.type == 'page') {
    return (
      <PageNode
        node={node}
        index={index}
        isFocused={isFocused}
        updateFocusedIndex={updateFocusedIndex}
        updateNodeValue={updateNodeValue}
        addNode={addNode}
        removeNode={removeNode}
      />
    )
  }

  return null
}
