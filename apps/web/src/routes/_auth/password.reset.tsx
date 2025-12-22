import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { AlertCircleIcon, ChevronLeft } from 'lucide-react'

import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { FieldGroup } from '@workspace/ui/components/field'

import { useAuthFormStore } from '@/hooks/use-auth-form-store'
import { ResetPasswordForm } from '@/routes/_auth/-components/reset-password-form'
import { Logo } from '@/routes/-components/logo'

export const Route = createFileRoute('/_auth/password/reset')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Reset password',
      },
    ],
  }),
})

function RouteComponent() {
  const { store: authStore } = useAuthFormStore()

  const errorMessage = useStore(authStore, (state) => state.errorMessage)

  return (
    <div className={'bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-4 md:p-10'}>
      <div className={'flex w-full max-w-md flex-col gap-6'}>
        <Link to={'/'} className={'mx-auto'}>
          <Logo />
        </Link>

        <Card>
          <CardHeader className="text-center">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircleIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>Enter your email address to receive a password reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <ResetPasswordForm />
            </FieldGroup>
          </CardContent>
        </Card>
        <Button asChild variant="outline-ghost" className={'mr-auto hover:bg-transparent dark:hover:bg-transparent'}>
          <Link to="/login">
            <ChevronLeft /> Back to Login
          </Link>
        </Button>
      </div>
    </div>
  )
}
