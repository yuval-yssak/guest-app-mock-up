import * as React from 'react'
import { RootStoreType } from './RootStore'
const MSTContext = React.createContext<RootStoreType>(null as any)

export const Provider = MSTContext.Provider

export function useMst() {
  const store = React.useContext(MSTContext)

  return store
}
