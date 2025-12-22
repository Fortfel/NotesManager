import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'

import { authSchema, getErrorMessage } from '@workspace/auth/client'
import { Field, FieldDescription, FieldGroup } from '@workspace/ui/components/field'
import { cn } from '@workspace/ui/lib/utils'

import { revalidateLogic, useAppForm } from '@/hooks/use-app-form'
import { useAuthFormStore } from '@/hooks/use-auth-form-store'
import { authClient } from '@/lib/auth-client'
import { loginLinkOptions } from '@/routes/_auth/-validations/auth-link-options'

const formSchema = authSchema.registerSchema

const RegisterForm = ({
  beforeSubmit,
  onSuccess,
  className,
  ...props
}: React.ComponentProps<'div'> & { beforeSubmit?: () => void; onSuccess?: () => void }) => {
  const { setErrorMessage, clearErrorMessage, store: authStore, setIsFormSubmitting } = useAuthFormStore()

  const isSocialPending = useStore(authStore, (state) => state.isSocialPending)

  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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
        const { error } = await authClient.signUp.email(
          {
            name: value.name,
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
    <div data-slot="register-form" className={cn('flex flex-col gap-6', className)} {...props}>
      <form.AppForm>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.AppField name="name">
              {(field) => <field.TextField label="Full Name" placeholder="John Doe" autoComplete="name" required />}
            </form.AppField>

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
                  description="Must be at least 8 characters long."
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(field) => (
                <field.PasswordField
                  label="Confirm Password"
                  description="Please confirm your password."
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />
              )}
            </form.AppField>

            <Field>
              <form.SubscribeButton label="Create account" isPending={isSocialPending} gradient={'normal'} />
              <FieldDescription className="text-center">
                Already have an account? <Link {...loginLinkOptions}>Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </form.AppForm>
    </div>
  )
}

export { RegisterForm }
