import type * as React from 'react'
import { toast } from 'sonner'

import { authSchema } from '@workspace/auth/client'
import { Field, FieldGroup } from '@workspace/ui/components/field'
import { cn } from '@workspace/ui/lib/utils'

import { revalidateLogic, useAppForm } from '@/hooks/use-app-form'

const formSchema = authSchema.resetPasswordSchema

const ResetPasswordForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      // DEBUGGING
      try {
        // Assuming an async function
        await new Promise((resolve) => setTimeout(resolve, 2000))
        console.log(value)
        toast('You submitted the following values:', {
          description: (
            <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
              <code>{JSON.stringify(value, null, 2)}</code>
            </pre>
          ),
          position: 'bottom-right',
          classNames: {
            content: 'flex flex-col gap-2',
          },
          style: {
            '--border-radius': 'calc(var(--radius)  + 4px)',
          } as React.CSSProperties,
        })
      } catch (error) {
        console.error('Form submission error', error)
        toast.error('Failed to submit the form. Please try again.')
      }
    },
  })

  return (
    <div data-slot="reset-password-form" className={cn('flex flex-col gap-6', className)} {...props}>
      <form.AppForm>
        <form
          id="reset-password-form"
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

            <Field>
              <form.SubscribeButton label="Reset password" />
            </Field>
          </FieldGroup>
        </form>
      </form.AppForm>
    </div>
  )
}

export { ResetPasswordForm }
