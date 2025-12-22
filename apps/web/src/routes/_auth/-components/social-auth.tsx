import * as React from 'react'
import { IconBrandDiscord, IconBrandGoogleFilled } from '@tabler/icons-react'
import { useStore } from '@tanstack/react-store'
import urlJoin from 'url-join'

import type { SocialProviders } from '@workspace/auth/server'
import { getErrorMessage } from '@workspace/auth/client'
import { Button } from '@workspace/ui/components/button'
import { CircleSpinner } from '@workspace/ui/components/spinner'

import { useAuthFormStore } from '@/hooks/use-auth-form-store'
import { authClient } from '@/lib/auth-client'

interface SocialAuthProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
  provider: SocialProviders
  label: string
  // The URL to redirect to after successful authentication. Default is "/".
  redirectUrl?: string
  beforeSubmit?: () => void
}

const providerIcons = {
  google: <IconBrandGoogleFilled />,
  discord: <IconBrandDiscord />,
} as const satisfies Record<SocialProviders, React.ReactNode>

const SocialAuth = ({ provider, label, redirectUrl = '/', beforeSubmit, ...props }: SocialAuthProps) => {
  const { setErrorMessage, clearErrorMessage, store, setIsSocialPending } = useAuthFormStore()
  const [isLoading, setIsLoading] = React.useState(false)

  const isSocialPending = useStore(store, (state) => state.isSocialPending)
  const isFormSubmitting = useStore(store, (state) => state.isFormSubmitting)

  React.useEffect(() => {
    setIsSocialPending(isLoading)
  }, [isLoading, setIsSocialPending])

  const onSubmit = async () => {
    try {
      beforeSubmit?.()
      clearErrorMessage()

      // Set loading state before the OAuth call
      setIsLoading(true)

      const { error } = await authClient.signIn.social({
        provider: provider,
        /**
         * IMPORTANT: Add ?refetchSession=true to callback URL
         *
         * Why: When linking accounts (e.g., email login → OAuth),
         * Better Auth updates the database with new user info (name, image)
         * due to `overrideUserInfoOnSignIn: true` config, but the client-side
         * session cache remains stale.
         *
         * The refetchSession param triggers a fresh session fetch in _app/layout.tsx,
         * ensuring the UI shows updated user data immediately after OAuth login.
         */
        callbackURL: urlJoin(window.location.origin, redirectUrl, '?refetchSession=true'),
      })

      if (error) {
        // Only clear loading state if there's an error
        setIsLoading(false)

        const message = error.code
          ? (getErrorMessage({ code: error.code, lang: 'en' }) ?? error.message)
          : error.message

        setErrorMessage(message ?? JSON.stringify(error))
      }
      // If no error, browser will redirect, so don't clear the state
    } catch {
      setIsLoading(false)
      setErrorMessage('Failed to submit the form. Please try again.')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={() => void onSubmit()}
      disabled={isLoading || isFormSubmitting || isSocialPending}
      {...props}
    >
      {isLoading && <CircleSpinner size="sm" />} {providerIcons[provider]} {label}
    </Button>
  )
}

export { SocialAuth }
