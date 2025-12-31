import * as React from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { Popover, PopoverAnchor, PopoverContent } from '@workspace/ui/components/popover'
import { cn } from '@workspace/ui/lib/utils'

type CommandPanel<TType extends string = string> = {
  value: TType
  name: string
}

interface CommandPanelProps<TType extends string = string> {
  commands: ReadonlyArray<CommandPanel<TType>>
  onSelect: (type: TType) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}

export const CommandPanel = <TType extends string = string>({
  commands,
  onSelect,
  open,
  onOpenChange,
  className,
}: CommandPanelProps<TType>) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      // Small delay to ensure the popover is rendered
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        <div className="absolute left-0 top-0 h-0 w-0" />
      </PopoverAnchor>
      <PopoverContent
        className={cn('w-[300px] p-0', className)}
        align="start"
        side="bottom"
        sideOffset={4}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          inputRef.current?.focus()
        }}
      >
        <Command>
          <CommandInput ref={inputRef} onKeyDown={handleKeyDown} placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No commands found</CommandEmpty>
            <CommandGroup>
              {commands.map((cmd) => (
                <CommandItem
                  key={cmd.value}
                  value={cmd.value}
                  onSelect={() => {
                    onSelect(cmd.value)
                    onOpenChange(false)
                  }}
                >
                  {cmd.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
