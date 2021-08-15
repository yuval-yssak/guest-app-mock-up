import * as React from 'react'

// This hook issues a callback when a prop is sustained for a certain timeout
export function useWhenPropSustained(
  prop: unknown,
  timeout: number,
  callback: () => void
) {
  const initialTimeRef = React.useRef(Date.now())

  React.useEffect(() => {
    initialTimeRef.current = Date.now()
  }, [prop])

  React.useEffect(() => {
    setTimeout(() => {
      if (Date.now() - initialTimeRef.current >= timeout) callback()
    }, timeout)
  }, [prop, timeout, callback])
}
