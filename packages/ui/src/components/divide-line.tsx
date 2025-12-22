import type * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@workspace/ui/lib/utils'

type DivideLinePropsHorizontal = React.ComponentProps<'div'> & {
  orientation: 'horizontal'
  position: 'top' | 'bottom' | 'both'
  variant?: 'fullBleed' | 'default'
}
type DivideLinePropsVertical = React.ComponentProps<'div'> & {
  orientation: 'vertical'
  position: 'left' | 'right' | 'both'
  variant?: 'fullBleed' | 'default'
}
type DivideLineProps = DivideLinePropsHorizontal | DivideLinePropsVertical
type DivideLinePseudoProps = (DivideLinePropsHorizontal | DivideLinePropsVertical) & { asChild?: boolean }

function DivideLine({ variant = 'default', orientation, position, children, className, ...props }: DivideLineProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div data-slot="divide-line-container" className="relative">
      {(position === 'top' || position === 'left' || position === 'both') && (
        <div
          data-slot="divide-line"
          data-variant={variant}
          data-orientation={orientation}
          data-position={position === 'both' ? (isHorizontal ? 'top' : 'left') : position}
          aria-hidden="true"
          className={cn(
            'bg-border z-1 absolute shrink-0',
            'data-[orientation=horizontal]:h-px',
            'data-[orientation=vertical]:w-px',
            'data-[position=top]:top-0',
            'data-[position=bottom]:bottom-0',
            'data-[position=left]:left-0',
            'data-[position=right]:right-0',
            'data-[variant=default]:data-[orientation=horizontal]:inset-x-0',
            'data-[variant=default]:data-[orientation=vertical]:inset-y-0',
            'data-[variant=fullBleed]:data-[orientation=horizontal]:left-[-100vw]',
            'data-[variant=fullBleed]:data-[orientation=horizontal]:w-[200vw]',
            'data-[variant=fullBleed]:data-[orientation=vertical]:top-[-100vh]',
            'data-[variant=fullBleed]:data-[orientation=vertical]:h-[200vh]',
            className,
          )}
          {...props}
        />
      )}
      {children}
      {(position === 'bottom' || position === 'right' || position === 'both') && (
        <div
          data-slot="divide-line"
          data-variant={variant}
          data-orientation={orientation}
          data-position={position === 'both' ? (isHorizontal ? 'bottom' : 'right') : position}
          aria-hidden="true"
          className={cn(
            'bg-border z-1 absolute shrink-0',
            'data-[orientation=horizontal]:h-px',
            'data-[orientation=vertical]:w-px',
            'data-[position=top]:top-0',
            'data-[position=bottom]:bottom-0',
            'data-[position=left]:left-0',
            'data-[position=right]:right-0',
            'data-[variant=default]:data-[orientation=horizontal]:inset-x-0',
            'data-[variant=default]:data-[orientation=vertical]:inset-y-0',
            'data-[variant=fullBleed]:data-[orientation=horizontal]:left-[-100vw]',
            'data-[variant=fullBleed]:data-[orientation=horizontal]:w-[200vw]',
            'data-[variant=fullBleed]:data-[orientation=vertical]:top-[-100vh]',
            'data-[variant=fullBleed]:data-[orientation=vertical]:h-[200vh]',
            className,
          )}
          {...props}
        />
      )}
    </div>
  )
}

function DivideLinePseudo({
  variant = 'default',
  orientation,
  position,
  asChild = false,
  children,
  className,
  ...props
}: DivideLinePseudoProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="divide-line-pseudo"
      data-variant={variant}
      data-orientation={orientation}
      data-position={position}
      className={cn(
        'relative',
        'before:bg-border before:z-1 before:absolute before:shrink-0',
        'after:bg-border after:z-1 after:absolute after:shrink-0',

        // Orientation
        'data-[orientation=horizontal]:before:h-px data-[orientation=horizontal]:after:h-px',
        'data-[orientation=vertical]:before:w-px data-[orientation=vertical]:after:w-px',

        // Position - semantic (before=top/left, after=bottom/right)
        'data-[orientation=horizontal]:data-[position=top]:before:top-0',
        'data-[orientation=horizontal]:data-[position=bottom]:after:bottom-0',
        'data-[orientation=vertical]:data-[position=left]:before:left-0',
        'data-[orientation=vertical]:data-[position=right]:after:right-0',

        // Both position
        'data-[orientation=horizontal]:data-[position=both]:before:top-0',
        'data-[orientation=horizontal]:data-[position=both]:after:bottom-0',
        'data-[orientation=vertical]:data-[position=both]:before:left-0',
        'data-[orientation=vertical]:data-[position=both]:after:right-0',

        // Default variant insets
        'data-[variant=default]:data-[orientation=horizontal]:before:inset-x-0',
        'data-[variant=default]:data-[orientation=horizontal]:after:inset-x-0',
        'data-[variant=default]:data-[orientation=vertical]:before:inset-y-0',
        'data-[variant=default]:data-[orientation=vertical]:after:inset-y-0',

        // Full bleed variant
        'data-[variant=fullBleed]:data-[orientation=horizontal]:before:left-[-100vw]',
        'data-[variant=fullBleed]:data-[orientation=horizontal]:before:w-[200vw]',
        'data-[variant=fullBleed]:data-[orientation=horizontal]:after:left-[-100vw]',
        'data-[variant=fullBleed]:data-[orientation=horizontal]:after:w-[200vw]',
        'data-[variant=fullBleed]:data-[orientation=vertical]:before:top-[-100vh]',
        'data-[variant=fullBleed]:data-[orientation=vertical]:before:h-[200vh]',
        'data-[variant=fullBleed]:data-[orientation=vertical]:after:top-[-100vh]',
        'data-[variant=fullBleed]:data-[orientation=vertical]:after:h-[200vh]',

        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

export { DivideLine, DivideLinePseudo }
