import type { AuthFormStoreState } from '@/providers/auth-form-store-provider'
import * as React from 'react'

import { AuthFormStoreContext } from '@/providers/auth-form-store-provider'

const useAuthFormStore = () => {
  const store = React.useContext(AuthFormStoreContext)
  if (!store) {
    throw new Error('useAuthFormStore must be used within a AuthFormStoreProvider')
  }
  return React.useMemo(
    () => ({
      store,
      setErrorMessage: (errorMessage: AuthFormStoreState['errorMessage']) =>
        store.setState((s) => ({ ...s, errorMessage })),
      clearErrorMessage: () => store.setState((s) => ({ ...s, errorMessage: null })),
      setIsFormSubmitting: (isFormSubmitting: AuthFormStoreState['isFormSubmitting']) =>
        store.setState((s) => ({ ...s, isFormSubmitting })),
      setIsSocialPending: (isSocialPending: AuthFormStoreState['isSocialPending']) =>
        store.setState((s) => ({ ...s, isSocialPending })),
    }),
    [store],
  )
}

export { useAuthFormStore }
