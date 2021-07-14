import * as React from 'react'

export const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, any>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>()
    const resolvedRef = defaultRef || ref

    React.useEffect(() => {
      resolvedRef.current!.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)
