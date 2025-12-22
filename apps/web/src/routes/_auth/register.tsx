import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { AlertCircleIcon, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@workspace/ui/components/field'

import { useAuthFormStore } from '@/hooks/use-auth-form-store'
import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'
import { RegisterForm } from '@/routes/_auth/-components/register-form'
import { SocialAuth } from '@/routes/_auth/-components/social-auth'
import { Logo } from '@/routes/-components/logo'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Sign Up',
      },
    ],
  }),
})

function RouteComponent() {
  const { store: authStore } = useAuthFormStore()
  const navigate = Route.useNavigate()

  const errorMessage = useStore(authStore, (state) => state.errorMessage)

  const onSuccessCallback = () => {
    toast.success('Registration successful!')
    void navigate({ to: '/', replace: true })
  }

  return (
    <div className={'bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-4 md:p-10'}>
      <div className={'flex w-full max-w-md flex-col gap-6'}>
        <Link {...homeLinkOptions} className={'mx-auto w-fit'} aria-label="Todos - Go to homepage">
          <Logo aria-hidden="true" />
        </Link>

        <Card>
          <CardHeader>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircleIcon />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            <CardTitle className="text-center text-xl">Create your account</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <SocialAuth provider="google" label={'Sign up with Google'} />
                <SocialAuth provider="discord" label={'Sign up with Discord'} />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <RegisterForm onSuccess={onSuccessCallback} />
            </FieldGroup>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking Create Account or registering through a third party, you agree to our{' '}
          <Link to={'.'}>Terms of Service</Link> and <Link to={'.'}>Privacy Policy</Link>.
        </FieldDescription>
        <Button asChild variant="outline-ghost" className={'mr-auto'}>
          <Link {...homeLinkOptions}>
            <ChevronLeft /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}
