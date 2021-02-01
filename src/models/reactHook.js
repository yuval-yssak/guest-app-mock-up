import * as React from 'react'
const MSTContext = React.createContext(null)

// eslint-disable-next-line prefer-destructuring
export const Provider = MSTContext.Provider

export function useMst() {
  const store = React.useContext(MSTContext)

  return store
}
