import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'

import { cn } from '@workspace/ui/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // Solid variants
        primary: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 border-primary',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 border-secondary',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/50 dark:bg-destructive/60 border-destructive dark:hover:bg-destructive/50',
        info: 'bg-info text-info-foreground shadow-xs hover:bg-info/90 focus-visible:ring-info/50 border-info',
        success:
          'bg-success text-success-foreground shadow-xs hover:bg-success/90 focus-visible:ring-success/50 border-success',
        warning:
          'bg-warning text-warning-foreground shadow-xs hover:bg-warning/90 focus-visible:ring-warning/50 border-warning',

        // Soft variants
        'primary-soft':
          'bg-primary/6 text-primary border border-primary/15 shadow-xs hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 focus-visible:border-primary/50',
        'secondary-soft':
          'bg-secondary/6 text-secondary-foreground border border-secondary/15 shadow-xs hover:bg-secondary/20 focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 focus-visible:border-secondary/50',
        'destructive-soft':
          'bg-destructive/6 text-destructive border border-destructive/15 shadow-xs hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 focus-visible:border-destructive/50',
        'info-soft':
          'bg-info/6 text-info border border-info/15 shadow-xs hover:bg-info/20 focus-visible:ring-info/20 dark:focus-visible:ring-info/40 focus-visible:border-info/50',
        'success-soft':
          'bg-success/6 text-success border border-success/15 shadow-xs hover:bg-success/20 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 focus-visible:border-success/50',
        'warning-soft':
          'bg-warning/6 text-warning border border-warning/15 shadow-xs hover:bg-warning/20 focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 focus-visible:border-warning/50',

        // Outline variants
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        'primary-outline':
          'border border-primary text-primary bg-transparent shadow-xs hover:bg-primary/10 focus-visible:ring-primary/50 focus-visible:border-primary/50',
        'secondary-outline':
          'border border-secondary text-secondary-foreground bg-transparent shadow-xs hover:bg-secondary/10 focus-visible:ring-secondary/50 focus-visible:border-secondary/50',
        'destructive-outline':
          'border border-destructive text-destructive bg-transparent shadow-xs hover:bg-destructive/10 focus-visible:ring-destructive/50 focus-visible:border-destructive/50',
        'info-outline':
          'border border-info text-info bg-transparent shadow-xs hover:bg-info/10 focus-visible:ring-info/50 focus-visible:border-info/50',
        'success-outline':
          'border border-success text-success bg-transparent shadow-xs hover:bg-success/10 focus-visible:ring-success/50 focus-visible:border-success/50',
        'warning-outline':
          'border border-warning text-warning bg-transparent shadow-xs hover:bg-warning/10 focus-visible:ring-warning/50 focus-visible:border-warning/50',

        // Ghost variants
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        'primary-ghost': 'text-primary hover:bg-primary/10 focus-visible:ring-primary/50',
        'secondary-ghost': 'text-secondary-foreground hover:bg-secondary/10 focus-visible:ring-secondary/50',
        'destructive-ghost': 'text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/50',
        'info-ghost': 'text-info hover:bg-info/10 focus-visible:ring-info/50',
        'success-ghost': 'text-success hover:bg-success/10 focus-visible:ring-success/50',
        'warning-ghost': 'text-warning hover:bg-warning/10 focus-visible:ring-warning/50',

        // Special variants
        'outline-ghost':
          'border shadow-xs hover:bg-accent/30 hover:text-accent-foreground dark:hover:bg-accent/10 dark:border-input',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
      gradient: {
        default: '',
        normal:
          'relative border isolate before:from-white/20 after:from-white/10 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay',
        intense:
          'relative border isolate before:from-white/30 after:from-white/15 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-gradient-to-b before:opacity-80 before:transition-opacity after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-md after:bg-gradient-to-b after:to-transparent after:mix-blend-overlay',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      gradient: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  gradient,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, gradient, className }))} {...props} />
}

export { Button, buttonVariants }
