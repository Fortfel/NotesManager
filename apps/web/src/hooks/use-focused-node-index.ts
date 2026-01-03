import * as React from 'react'

type UseFocusedNodeIndexProps = {
  nodes: Array<unknown>
  shouldIgnoreKeys?: () => boolean // Add this
}

export const useFocusedNodeIndex = ({
  nodes,
  shouldIgnoreKeys,
}: UseFocusedNodeIndexProps): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [focusedNodeIndex, setFocusedNodeIndex] = React.useState(0)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Check if we should ignore keys (e.g., command panel is open)
      if (shouldIgnoreKeys?.()) {
        return
      }

      if (event.key === 'ArrowUp') {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0))
      }
      if (event.key === 'ArrowDown') {
        setFocusedNodeIndex((index) => Math.min(index + 1, nodes.length - 1))
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [nodes, shouldIgnoreKeys])

  return [focusedNodeIndex, setFocusedNodeIndex]
}
