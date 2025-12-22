import type * as React from 'react'

import { Button } from '@workspace/ui/components/button'
import { CircleSpinner } from '@workspace/ui/components/spinner'

import { useFormContext } from './contexts/form-context'

interface SubscribeButtonProps extends React.ComponentProps<typeof Button> {
  label: React.ReactNode
  // If true sets button as disabled. False by default
  isPending?: boolean
}

const SubscribeButton = ({ label, isPending = false, ...props }: SubscribeButtonProps) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" size={'lg'} disabled={!canSubmit || isPending} {...props}>
          {isSubmitting && <CircleSpinner size="sm" />} {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

export { SubscribeButton }
