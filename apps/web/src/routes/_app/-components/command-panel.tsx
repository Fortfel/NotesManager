import * as React from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { cn } from '@workspace/ui/lib/utils'

type CommandPanel<TType extends string = string> = {
  value: TType
  name: string
}

interface CommandPanelProps<TType extends string = string> {
  commands: ReadonlyArray<CommandPanel<TType>>
  onSelect: (type: TType) => void
  onClose?: () => void
  className?: string
}

export const CommandPanel = <TType extends string = string>({
  commands,
  onSelect,
  onClose,
  className,
}: CommandPanelProps<TType>) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div className="absolute left-0 top-full">
      <Command className={cn('bg-popover z-50 mt-1 w-[300px] rounded-lg border shadow-md', className)}>
        <CommandInput ref={inputRef} onKeyDown={handleKeyDown} placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No commands found</CommandEmpty>
          <CommandGroup>
            {commands.map((cmd) => (
              <CommandItem key={cmd.value} value={cmd.value} onSelect={() => onSelect(cmd.value)}>
                {cmd.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
