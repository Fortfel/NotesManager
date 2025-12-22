import type * as React from 'react'

import { cn } from '@workspace/ui/lib/utils'

import { LogoIcon } from '@/routes/-components/logo-icon'

const Logo = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      role="img"
      aria-label="Application logo"
      className={cn('flex w-fit items-center gap-2 text-2xl', className)}
      {...props}
    >
      <div className={'bg-destructive text-destructive-foreground flex size-9 items-center justify-center rounded-md'}>
        <LogoIcon aria-hidden="true" />
      </div>
      <span className={'font-semibold leading-5 tracking-tighter'}>todos</span>
    </div>
  )
}

export { Logo }
