import { createAuthClient as createBetterAuthClient } from 'better-auth/react'
import urlJoin from 'url-join'

export { authSchema } from '@workspace/auth/server'

export interface AuthClientOptions {
  apiBaseUrl: string
  apiBasePath: string
}

export const createAuthClient = ({
  apiBaseUrl,
  apiBasePath,
}: AuthClientOptions): ReturnType<typeof createBetterAuthClient> =>
  createBetterAuthClient({
    baseURL: urlJoin(apiBaseUrl, apiBasePath, 'auth'),

    /**
     * Only uncomment the line below if you are using plugins, so that
     * your types can be correctly inferred.
     * Ensure that you are using the client-side version of the plugin,
     * e.g. `adminClient` instead of `admin`.
     */
    // plugins: []
  })

type ErrorTypes = Partial<Record<keyof ReturnType<typeof createAuthClient>['$ERROR_CODES'], { en: string }>>

const errorCodes = {
  USER_ALREADY_EXISTS: {
    en: 'User already exists',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    en: 'Invalid email or password',
  },
} satisfies ErrorTypes

export const getErrorMessage = ({ code, lang = 'en' }: { code: string; lang?: 'en' }) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes][lang] || null
  }
  return null
}
