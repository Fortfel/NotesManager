import { linkOptions } from '@tanstack/react-router'
import { z } from 'zod'

export const authSearchParamsSchema = z.object({
  redirect: z.string().default('/').catch('/'),
})

export type AuthSearchParams = z.infer<typeof authSearchParamsSchema>

export const authSearchParamsDefaults = authSearchParamsSchema.parse({})

export const loginLinkOptions = linkOptions({
  to: '/login',

  /**
   * If we want links to contain default values in the URL
   */
  // search: authSearchParamsDefaults,
})

export const authErrorLinkOptions = linkOptions({
  to: '/auth/error',
})
