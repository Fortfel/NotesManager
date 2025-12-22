import type * as React from 'react'
import { Link } from '@tanstack/react-router'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@workspace/ui/components/navigation-menu'
import { cn } from '@workspace/ui/lib/utils'

import { navigationLinks } from './data'

const NavMain = ({ viewport = false, className, ...props }: React.ComponentProps<'div'> & { viewport?: boolean }) => {
  return (
    <div data-slot="navbar-menu" className={cn(className)} {...props}>
      <NavigationMenu viewport={viewport}>
        <NavigationMenuList>
          {navigationLinks.map((link) => (
            <NavigationMenuItem key={link.label}>
              <NavigationMenuLink asChild>
                <Link
                  to={link.href}
                  onClick={(e) => {
                    // Blur the link after clicking to remove focus styles
                    e.currentTarget.blur()
                  }}
                  className={cn(
                    'transition-colors',
                    'hover:bg-black/4 focus:bg-black/4 focus:text-foreground hover:text-foreground [&.active]:text-black',
                    'dark:hover:text-foreground dark:focus:text-foreground dark:hover:bg-white/5 dark:focus:bg-white/5 dark:[&.active]:text-white',
                  )}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export { NavMain }
