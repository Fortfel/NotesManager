import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { AlertCircleIcon, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@workspace/ui/components/field'

import { useAuthFormStore } from '@/hooks/use-auth-form-store'
import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'
import { LoginForm } from '@/routes/_auth/-components/login-form'
import { SocialAuth } from '@/routes/_auth/-components/social-auth'
import { Logo } from '@/routes/-components/logo'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Login',
      },
    ],
  }),
})

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const { store: authStore } = useAuthFormStore()

  const errorMessage = useStore(authStore, (state) => state.errorMessage)

  const onSuccessCallback = () => {
    toast.success('Login successful')
    void navigate({ to: search.redirect, replace: true })
  }

  return (
    <div className={'bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-4 md:p-10'}>
      <div className={'flex w-full max-w-md flex-col gap-6'}>
        <Link {...homeLinkOptions({ withLabel: true })} className={'mx-auto w-fit'}>
          <Logo aria-hidden="true" />
        </Link>

        <Card>
          <CardHeader>
            <Alert variant="info" className="mb-4">
              <AlertCircleIcon />
              <AlertTitle>Test credentials:</AlertTitle>
              <AlertDescription>
                <span>
                  <strong>demo@example.com</strong> / <strong>secretPassword</strong>
                </span>
              </AlertDescription>
            </Alert>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircleIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <CardTitle className="text-center text-xl">Login to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <SocialAuth provider="google" label={'Login with Google'} redirectUrl={search.redirect} />
                <SocialAuth provider="discord" label={'Login with Discord'} redirectUrl={search.redirect} />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <LoginForm onSuccess={onSuccessCallback} />
            </FieldGroup>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking Login or signing in through a third party, you agree to our <Link to={'.'}>Terms of Service</Link>{' '}
          and <Link to={'.'}>Privacy Policy</Link>.
        </FieldDescription>
        <Button asChild variant="outline-ghost" className={'mr-auto'}>
          <Link {...homeLinkOptions()}>
            <ChevronLeft /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}
