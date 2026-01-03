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
  commandPanelOpenRef: React.RefObject<boolean>
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
  commandPanelOpenRef,
  className,
  ...props
}: React.ComponentProps<'div'> & BasicNodeProps) => {
  const nodeRef = React.useRef<HTMLDivElement>(null)
  const [isCommandPanelOpen, setIsCommandPanelOpen] = React.useState(false)

  const shouldShowCommandPanel = isFocused && node.value.startsWith('/')

  // Update command panel open state when shouldShowCommandPanel changes
  React.useEffect(() => {
    setIsCommandPanelOpen(shouldShowCommandPanel)
  }, [shouldShowCommandPanel])

  React.useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    commandPanelOpenRef.current = isCommandPanelOpen
  }, [isCommandPanelOpen, commandPanelOpenRef])

  // Sync content and focus state
  React.useEffect(() => {
    const element = nodeRef.current
    if (!element) return

    // Only update content if we're not actively editing
    if (document.activeElement !== element) {
      element.textContent = node.value
    }

    // Don't focus the node if command panel is open
    if (isFocused && !isCommandPanelOpen) {
      element.focus()
      // move cursor to end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(element)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    } else if (!isFocused) {
      element.blur()
    }
  }, [node.value, isFocused, isCommandPanelOpen])

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    updateNodeValue(e.currentTarget.textContent || '', index)
  }

  const handleClick = () => {
    updateFocusedIndex(index)
  }

  const handleCommandSelect = (type: NodeType) => {
    setIsCommandPanelOpen(false)
    updateNodeValue('', index)
    if (updateNodeType) {
      updateNodeType(type, index)
    }
  }

  const handleCommandClose = () => {
    setIsCommandPanelOpen(false)
    updateNodeValue('', index)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const content = target.textContent || ''
    const selection = window.getSelection()
    const cursorPosition = selection?.anchorOffset ?? 0

    // Check if we're about to type '/' at the start, or if command panel is already open
    const willStartCommand = e.key === '/' && content.length === 0
    const isCommandPanelActive = shouldShowCommandPanel || isCommandPanelOpen || willStartCommand

    // Block navigation when command panel is or will be active
    if (isCommandPanelActive && e.key !== '/') {
      if (
        e.key === 'Enter' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      // Allow Escape to close command panel
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsCommandPanelOpen(false)
        updateNodeValue('', index)
        return
      }
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
  }

  return (
    <div data-slot="basic-node" className={cn('relative', className)} {...props}>
      {isCommandPanelOpen && (
        <CommandPanel open={isCommandPanelOpen} onOpenChange={handleCommandClose} onSelect={handleCommandSelect} />
      )}
      <div
        ref={nodeRef}
        onInput={handleInput}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Type '/' for commands"
        className={cn(
          'min-h-[1.5em] py-1 outline-none',
          node.type === 'list' ? 'list-item list-inside list-disc' : 'list-none',
          node.type === 'heading1' ? 'text-2xl font-bold' : '',
          node.type === 'heading2' ? 'text-xl font-bold' : '',
          node.type === 'heading3' ? 'text-lg font-bold' : '',
          // Only show placeholder when focused
          isFocused && 'empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]',
        )}
        role="textbox"
        tabIndex={0}
        aria-label={`Node ${(index + 1).toString()}`}
      />
    </div>
  )
}

export { BasicNode }
