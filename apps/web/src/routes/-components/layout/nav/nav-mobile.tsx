import * as React from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Menu } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Separator } from '@workspace/ui/components/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet'
import { useControllableState } from '@workspace/ui/hooks/use-controllable-state'
import { cn } from '@workspace/ui/lib/utils'

import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'
import { Logo } from '@/routes/-components/logo'
import { navigationLinks } from './data'

type NavMobileProps = {
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
} & React.ComponentProps<'div'>

const NavMobile = ({ isOpen, defaultOpen = false, onOpenChange, className, ...props }: NavMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useControllableState({
    prop: isOpen,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  const router = useRouter()

  // Close sheet on navigation
  React.useEffect(() => {
    const unsubscribe = router.subscribe('onBeforeLoad', () => {
      setIsMenuOpen(false)
    })

    return unsubscribe
  }, [router, setIsMenuOpen])

  return (
    <div data-slot="navbar-sheet" className={cn(className)} {...props}>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={'hover:bg-black/4 hover:text-foreground dark:hover:bg-white/5'}
          >
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={'w-xs'}>
          <SheetHeader className="-mb-2">
            <SheetTitle>
              <Link {...homeLinkOptions({ withLabel: true })} className={'w-fit'}>
                <Logo aria-hidden="true" />
              </Link>
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <div
            data-slot="navbar-sheet-content"
            className={cn(
              'flex flex-col gap-1 [&_a]:p-4 [&_a]:transition-colors',
              '[&_a.active]:bg-black/8 [&_a.active:hover]:bg-black/12 [&_a]:hover:bg-black/5 [&_a]:focus:bg-black/5 ',
              'dark:[&_a.active:hover]:bg-white/20 dark:[&_a.active]:bg-white/15 dark:[&_a]:hover:bg-white/10 dark:[&_a]:focus:bg-white/10',
            )}
          >
            {navigationLinks.map((link) => (
              <Link key={link.label} to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { NavMobile }
