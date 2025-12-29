import { linkOptions } from '@tanstack/react-router'
import { z } from 'zod'

export const appSearchParamsSchema = z.object({
  // Used to trigger session refetch after OAuth login
  // Set in the OAuth callbackURL to force fresh session data
  refetchSession: z.boolean().default(false).catch(false),
})

export type AppSearchParams = z.infer<typeof appSearchParamsSchema>

export const appSearchParamsDefaults = appSearchParamsSchema.parse({})

export const homeLinkOptions = linkOptions({
  to: '/',

  /**
   * If we want links to contain default values in the URL
   */
  // search: appSearchParamsDefaults,
})

export const pageLinkOptions = (pageId: string) =>
  linkOptions({
    to: '/$pageId',
    params: { pageId: pageId },
  })

export const profileLinkOptions = linkOptions({
  to: '/profile',
})

export const settingsLinkOptions = linkOptions({
  to: '/settings',
})

export const aboutLinkOptions = linkOptions({
  to: '/about',
})

export const contactLinkOptions = linkOptions({
  to: '/contact',
})
