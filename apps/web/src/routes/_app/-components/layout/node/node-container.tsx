import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

import { cn } from '@workspace/ui/lib/utils'

type NodeContainerProps = {
  id: string // Only need the ID for drag & drop
  children: React.ReactNode
  className?: string
}

export const NodeContainer = ({ id, children, className }: NodeContainerProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={cn('group flex items-start gap-2', className)}>
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-1.5 flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded opacity-0 transition-opacity hover:bg-gray-100 active:cursor-grabbing group-hover:opacity-100"
        aria-label="Drag to reorder"
        type="button"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </button>

      {/* Node Content */}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
