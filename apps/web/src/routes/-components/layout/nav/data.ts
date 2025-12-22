// @see https://tanstack.com/router/latest/docs/framework/react/guide/type-safety#avoid-internal-types-without-narrowing

import type { LinkProps } from '@tanstack/react-router'

type NavigationLinkBasic = {
  type: 'basic'
  label: string
  href: LinkProps['to']
}

// type NavigationLinkIcon = {
//   type: 'icon'
//   label: string
//   href: LinkProps['to']
//   // submenu?: boolean
//   // items?: ReadonlyArray<NavigationLinks>
// }

type NavigationLink = NavigationLinkBasic

// Navigation links array to be used in both desktop and mobile menus
export const navigationLinks = [
  { type: 'basic', label: 'About', href: '/about' },
  { type: 'basic', label: 'Contact', href: '/contact' },
] as const satisfies ReadonlyArray<NavigationLink>

export type NavigationLinks = (typeof navigationLinks)[number]
