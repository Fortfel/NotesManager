// @see https://github.com/felipestanzani/shadcn-tanstack-form/tree/master
// need this hook:
// import { fieldContext, formContext } from '@workspace/ui/components/form'
//
// export const { useAppForm, withForm } = createFormHook({
//   fieldContext,
//   formContext,
//   fieldComponents: {},
//   formComponents: {},
// })
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { createFormHookContexts, useStore } from '@tanstack/react-form'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from '@workspace/ui/components/field'

const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts()

function Form(props: React.ComponentProps<'form'>) {
  const form = useFormContext()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      {...props}
    />
  )
}

const IdContext = React.createContext<string>(null as never)

export function useFormItemContext() {
  const field = useFieldContext()
  const idContext = React.useContext(IdContext)

  if (typeof idContext !== 'string') {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error('Form Item components should be used within <FormItem>')
  }

  const errors = useStore(field.store, (state) => state.meta.errors as Array<unknown>)
  const isTouched = useStore(field.store, (state) => state.meta.isTouched)
  const submissionAttempts = useStore(field.form.store, (state) => state.submissionAttempts)

  const formItem = React.useMemo(() => {
    const shouldShowError = isTouched || submissionAttempts > 0

    return {
      formControlId: `${idContext}-form-item`,
      formDescriptionId: `${idContext}-form-item-description`,
      formMessageId: `${idContext}-form-item-message`,
      formTitleId: `${idContext}-form-item-title`,
      errors: errors,
      hasError: shouldShowError && errors.length > 0,
    }
  }, [idContext, isTouched, submissionAttempts, errors])

  return formItem
}

function FormItem({ children }: { children: React.ReactNode }) {
  const id = React.useId()

  return <IdContext.Provider value={id}>{children}</IdContext.Provider>
}

function FormField({ className, ...props }: React.ComponentProps<typeof Field>) {
  const { hasError } = useFormItemContext()

  return <Field data-invalid={hasError ? 'true' : undefined} className={className} {...props} />
}

function FormLabel({ className, ...props }: React.ComponentProps<typeof FieldLabel>) {
  const { formControlId, hasError } = useFormItemContext()

  return (
    <FieldLabel data-error={hasError ? 'true' : undefined} className={className} htmlFor={formControlId} {...props} />
  )
}

function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { formControlId, formDescriptionId, formMessageId, formTitleId, hasError } = useFormItemContext()

  const describedBy = [formDescriptionId, formTitleId, hasError ? formMessageId : null].filter(Boolean).join(' ')

  return <Slot id={formControlId} aria-describedby={describedBy || undefined} aria-invalid={hasError} {...props} />
}

function FormDescription({ className, ...props }: React.ComponentProps<typeof FieldDescription>) {
  const { formDescriptionId } = useFormItemContext()

  return <FieldDescription id={formDescriptionId} className={className} {...props} />
}

function FormMessage({ className, ...props }: React.ComponentProps<typeof FieldError>) {
  const { errors, hasError, formMessageId } = useFormItemContext()

  function getErrorMessage(error: unknown): string | null {
    if (typeof error === 'string') {
      return error
    }
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
      return error.message
    }
    if (error !== null && error !== undefined) {
      return String(error) // eslint-disable-line @typescript-eslint/no-base-to-string
    }
    return null
  }

  if (hasError) {
    return (
      <FieldError
        id={formMessageId}
        className={className}
        errors={errors.map((error) => ({ message: getErrorMessage(error) ?? undefined }))}
        {...props}
      />
    )
  }

  if (props.children) {
    return <FieldError id={formMessageId} className={className} {...props} />
  }

  return null
}

function FormTitle({ className, ...props }: React.ComponentProps<typeof FieldTitle>) {
  const { formTitleId } = useFormItemContext()

  return <FieldTitle id={formTitleId} className={className} {...props} />
}

function FormContent({ className, ...props }: React.ComponentProps<typeof FieldContent>) {
  return <FieldContent className={className} {...props} />
}

export {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormTitle,
  FormContent,
  fieldContext,
  useFieldContext,
  formContext,
  useFormContext,
}
