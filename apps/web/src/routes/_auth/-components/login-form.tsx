import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'

import { authSchema, getErrorMessage } from '@workspace/auth/client'
import { Field, FieldDescription, FieldGroup } from '@workspace/ui/components/field'
import { cn } from '@workspace/ui/lib/utils'

import { revalidateLogic, useAppForm } from '@/hooks/use-app-form'
import { useAuthFormStore } from '@/hooks/use-auth-form-store'
import { authClient } from '@/lib/auth-client'
import { passwordResetLinkOptions, registerLinkOptions } from '@/routes/_auth/-validations/auth-link-options'

const formSchema = authSchema.loginSchema

const LoginForm = ({
  beforeSubmit,
  onSuccess,
  className,
  ...props
}: React.ComponentProps<'div'> & { beforeSubmit?: () => void; onSuccess?: () => void }) => {
  const { setErrorMessage, clearErrorMessage, store: authStore, setIsFormSubmitting } = useAuthFormStore()

  const isSocialPending = useStore(authStore, (state) => state.isSocialPending)

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        beforeSubmit?.()
        clearErrorMessage()
        const { error } = await authClient.signIn.email(
          {
            email: value.email,
            password: value.password,
          },
          {
            onSuccess: () => {
              onSuccess?.()
            },
          },
        )

        if (error) {
          const message = error.code
            ? (getErrorMessage({ code: error.code, lang: 'en' }) ?? error.message)
            : error.message

          setErrorMessage(message ?? JSON.stringify(error))
        }
      } catch {
        setErrorMessage('Failed to submit the form. Please try again.')
      }
    },
  })

  const isFormSubmitting = useStore(form.store, (state) => state.isSubmitting)

  React.useEffect(() => {
    setIsFormSubmitting(isFormSubmitting)
  }, [isFormSubmitting, setIsFormSubmitting])

  return (
    <div data-slot="login-form" className={cn('flex flex-col gap-6', className)} {...props}>
      <form.AppForm>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField name="email">
              {(field) => (
                <field.TextField
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(field) => (
                <field.PasswordField
                  label="Password"
                  labelRight={
                    <Link {...passwordResetLinkOptions} className="text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </Link>
                  }
                  placeholder="Enter your password"
                  autoComplete="off"
                  required
                />
              )}
            </form.AppField>

            <Field>
              <form.SubscribeButton label="Login" isPending={isSocialPending} gradient={'normal'} />
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link {...registerLinkOptions}>Sign up</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </form.AppForm>
    </div>
  )
}

export { LoginForm }
