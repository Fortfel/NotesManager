import * as React from 'react'
import { Store } from '@tanstack/react-store'

import type { RouterOutputs } from '@workspace/api/server'

export interface AppStoreState {
  pages: RouterOutputs['notes']['all']
}

const AppStoreContext = React.createContext<Store<AppStoreState> | null>(null)

const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = React.useState(
    () =>
      new Store<AppStoreState>({
        pages: [],
      }),
  )

  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>
}

export { AppStoreProvider, AppStoreContext }
