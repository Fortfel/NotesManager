import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@workspace/ui/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        // Default (card background)
        default: 'bg-card text-card-foreground [&_[data-slot=alert-description]]:text-muted-foreground',

        // Subtle variants (light background)
        info: 'bg-info/6 text-info border-info/15 [&>svg]:text-info [&_[data-slot=alert-description]]:text-info/90',
        success:
          'bg-success/6 text-success border-success/15 [&>svg]:text-success [&_[data-slot=alert-description]]:text-success/90',
        warning:
          'bg-warning/6 text-warning border-warning/15 [&>svg]:text-warning [&_[data-slot=alert-description]]:text-warning/90',
        destructive:
          'bg-destructive/6 text-destructive border-destructive/15 [&>svg]:text-destructive [&_[data-slot=alert-description]]:text-destructive/90',

        // Solid variants (full color)
        'info-solid':
          'bg-info text-info-foreground border-info [&>svg]:text-info-foreground [&_[data-slot=alert-description]]:text-info-foreground/90',
        'success-solid':
          'bg-success text-success-foreground border-success [&>svg]:text-success-foreground [&_[data-slot=alert-description]]:text-success-foreground/90',
        'warning-solid':
          'bg-warning text-warning-foreground border-warning [&>svg]:text-warning-foreground [&_[data-slot=alert-description]]:text-warning-foreground/90',
        'destructive-solid':
          'bg-destructive text-destructive-foreground border-destructive [&>svg]:text-destructive-foreground [&_[data-slot=alert-description]]:text-destructive-foreground/90',

        // Outline variants (transparent background)
        'default-outline':
          'bg-transparent text-card-foreground [&_[data-slot=alert-description]]:text-muted-foreground',
        'info-outline':
          'bg-transparent border-info text-info [&>svg]:text-info [&_[data-slot=alert-description]]:text-info/80',
        'success-outline':
          'bg-transparent border-success text-success [&>svg]:text-success [&_[data-slot=alert-description]]:text-success/80',
        'warning-outline':
          'bg-transparent border-warning text-warning [&>svg]:text-warning [&_[data-slot=alert-description]]:text-warning/80',
        'destructive-outline':
          'bg-transparent border-destructive text-destructive [&>svg]:text-destructive [&_[data-slot=alert-description]]:text-destructive/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)
function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn('col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
