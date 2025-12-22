import * as React from 'react'
import { Store } from '@tanstack/react-store'

export interface AuthFormStoreState {
  isFormSubmitting: boolean
  isSocialPending: boolean
  errorMessage: string | null
}

const AuthFormStoreContext = React.createContext<Store<AuthFormStoreState> | null>(null)

const AuthFormStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = React.useState(
    () =>
      new Store<AuthFormStoreState>({
        isFormSubmitting: false,
        isSocialPending: false,
        errorMessage: null,
      }),
  )

  return <AuthFormStoreContext.Provider value={store}>{children}</AuthFormStoreContext.Provider>
}

export { AuthFormStoreProvider, AuthFormStoreContext }
