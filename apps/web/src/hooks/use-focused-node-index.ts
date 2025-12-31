import * as React from 'react'

type UseFocusedNodeIndexProps = {
  nodes: Array<unknown>
}

export const useFocusedNodeIndex = ({
  nodes,
}: UseFocusedNodeIndexProps): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [focusedNodeIndex, setFocusedNodeIndex] = React.useState(0)

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0))
      }
      if (event.key === 'ArrowDown') {
        setFocusedNodeIndex((index) => Math.min(index + 1, nodes.length - 1))
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [nodes])

  return [focusedNodeIndex, setFocusedNodeIndex]
}
