import type { NodeOutput } from '@/utils/types'
import * as React from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { CommandPanel } from '@/routes/_app/-components/command-panel'

type NodeType = NodeOutput['type']

interface BasicNodeProps {
  node: NodeOutput
  updateNodeValue: (value: string, index: number) => void
  updateNodeType?: (type: NodeType, index: number) => void
  addNode: (value: string, index: number) => void
  removeNode: (index: number) => void
  updateFocusedIndex: (index: number) => void
  isFocused: boolean
  index: number
}

const BasicNode = ({
  node,
  updateNodeValue,
  updateNodeType,
  addNode,
  removeNode,
  updateFocusedIndex,
  isFocused,
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & BasicNodeProps) => {
  const nodeRef = React.useRef<HTMLDivElement>(null)

  const shouldShowCommandPanel = isFocused && node.value.startsWith('/')

  // Sync content and focus state
  React.useEffect(() => {
    const element = nodeRef.current
    if (!element) return

    // Only update content if we're not actively editing
    if (document.activeElement !== element) {
      element.textContent = node.value
    }

    if (isFocused) {
      element.focus()
      // move cursor to end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(element)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    } else {
      element.blur()
    }
  }, [node.value, isFocused])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    updateNodeValue(e.currentTarget.textContent || '', index)
  }

  const handleClick = () => {
    updateFocusedIndex(index)
  }

  const handleCommandSelect = (type: NodeType) => {
    updateNodeValue('', index)
    if (updateNodeType) {
      updateNodeType(type, index)
    }
  }

  const handleCommandClose = () => {
    updateNodeValue('', index)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const content = target.textContent || ''
    const selection = window.getSelection()
    const cursorPosition = selection?.anchorOffset ?? 0

    // Don't handle Enter if command panel is open
    if (shouldShowCommandPanel && e.key === 'Enter') {
      e.preventDefault()
      return
    }

    // Regular Enter key
    if (e.key === 'Enter') {
      e.preventDefault()

      // Don't create new node if typing a command
      if (content.startsWith('/')) return

      addNode('', index)
      updateFocusedIndex(index + 1)
    }

    // Backspace handling
    if (e.key === 'Backspace') {
      // If current node is empty, remove it and focus previous
      if (content.length === 0) {
        e.preventDefault()
        removeNode(index)
        updateFocusedIndex(index - 1)
      }
      // If cursor is at the start, merge with previous node
      else if (cursorPosition === 0 && index > 0) {
        e.preventDefault()
        removeNode(index)
        updateFocusedIndex(index - 1)
      }
    }

    // Escape to close command panel
    if (e.key === 'Escape' && shouldShowCommandPanel) {
      e.preventDefault()
      updateNodeValue('', index)
    }
  }

  return (
    <div data-slot="basic-node" className={cn('relative', className)} {...props}>
      {shouldShowCommandPanel && (
        <CommandPanel open={shouldShowCommandPanel} onOpenChange={handleCommandClose} onSelect={handleCommandSelect} />
      )}
      <div
        ref={nodeRef}
        onInput={handleInput}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        contentEditable
        suppressContentEditableWarning
        className={cn(
          'min-h-[1.5em] py-1 outline-none',
          node.type === 'list' ? 'list-item list-inside list-disc' : 'list-none',
          node.type === 'heading1' ? 'text-2xl font-bold' : '',
          node.type === 'heading2' ? 'text-xl font-bold' : '',
          node.type === 'heading3' ? 'text-lg font-bold' : '',
        )}
        role="textbox"
        tabIndex={0}
        aria-label={`Node ${(index + 1).toString()}`}
      />
    </div>
  )
}

export { BasicNode }
