import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { DivideLinePseudo } from '@workspace/ui/components/divide-line'
import { Separator } from '@workspace/ui/components/separator'
import { useTheme } from '@workspace/ui/components/theme-provider'
import { ThemeSwitcherSwap, ThemeSwitcherToggle } from '@workspace/ui/components/theme-switcher'
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query'
import { cn } from '@workspace/ui/lib/utils'

import { config } from '@/config'
import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'
import { NavMain } from '@/routes/-components/layout/nav/nav-main'
import { NavMobile } from '@/routes/-components/layout/nav/nav-mobile'
import { NavUser } from '@/routes/-components/layout/nav/nav-user'
import { Logo } from '@/routes/-components/logo'

type NavbarProps = {
  // height of the navbar, default is 64px
  height?: string
}

const AppNavbar = ({ height = '64px', className, ...props }: NavbarProps & React.ComponentProps<'header'>) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const shouldShowThemeChangeAnimation = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 640px)')

  // Close mobile menu on desktop
  React.useEffect(() => {
    if (isDesktop && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isDesktop, isMenuOpen])

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <header
      data-slot="navbar"
      data-open={isMenuOpen}
      data-scrolled={isScrolled}
      className={cn('fixed inset-x-0 top-0 z-10 mr-[var(--removed-body-scroll-bar-size,0px)]', className)}
      style={{ '--nav-height': height } as React.CSSProperties}
      {...props}
    >
      <DivideLinePseudo
        orientation={'horizontal'}
        position={'bottom'}
        variant={'default'}
        asChild
        className={cn(
          'after:-bottom-[2px]! after:opacity-0 after:brightness-[0.8]  after:transition-opacity',
          isScrolled && 'after:opacity-100',
        )}
      >
        <div className={'border-border bg-background/80 border-b backdrop-blur-md'}>
          <div
            className={
              'mx-auto my-0 flex h-[var(--nav-height)] max-w-[var(--breakpoint-xl)] items-center justify-between px-2 sm:px-6 [&_[data-slot="separator"]]:h-6'
            }
          >
            <div className={'flex items-center justify-center gap-3'}>
              {/* Mobile Menu */}
              {!isDesktop && <NavMobile isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} className={'sm:hidden'} />}

              <Link {...homeLinkOptions({ withLabel: true })} className={'w-fit'}>
                <Logo aria-hidden="true" />
              </Link>
            </div>
            <div className={'flex items-center gap-4'}>
              {/* Desktop Menu */}
              <NavMain className={'hidden sm:block'} />
              <Separator orientation={'vertical'} className={'hidden sm:block'} />

              <div className={'flex items-center gap-4'}>
                <ThemeSwitcherToggle
                  themes={config.themes}
                  defaultValue={config.themeDefault}
                  onChange={setTheme}
                  value={theme}
                  labelToggle={'Toggle theme'}
                  enableAnimation={shouldShowThemeChangeAnimation}
                  className={
                    '[&>button]:hover:bg-black/4 [&>button]:hover:text-foreground hidden lg:block dark:[&>button]:hover:bg-white/5'
                  }
                />
                <ThemeSwitcherSwap
                  themes={config.themes}
                  defaultValue={config.themeDefault}
                  onChange={setTheme}
                  value={theme}
                  buttonVariant={'ghost'}
                  labelToggle={'Toggle theme'}
                  enableAnimation={shouldShowThemeChangeAnimation}
                  className={
                    '[&>button]:hover:bg-black/4 [&>button]:hover:text-foreground -mx-1 lg:hidden dark:[&>button]:hover:bg-white/5'
                  }
                />
                <Separator orientation={'vertical'} />
                <NavUser />
              </div>
            </div>
          </div>
        </div>
      </DivideLinePseudo>
    </header>
  )
}

export { AppNavbar }
