import * as React from 'react'
import { RootStore, RootStoreType } from './RootStore'
const MSTContext = React.createContext<RootStoreType>(RootStore.create({}))

export const Provider = MSTContext.Provider

export function useMst() {
  const store = React.useContext(MSTContext)

  return store
}
