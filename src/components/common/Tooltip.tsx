import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import styled from 'styled-components'

const TooltippedDiv = styled.div`
  overflow: hidden;
`

export function TooltipOnOverflow({
  children,
  tooltip,
  style
}: {
  children: React.ReactElement
  tooltip: NonNullable<React.ReactNode>
  style?: React.CSSProperties
}) {
  const ref = React.createRef<HTMLDivElement>()
  const [overflow, setOverflow] = React.useState(false)
  const [width, setWidth] = React.useState<number | null>()

  // observe child element width
  React.useEffect(() => {
    const observer = new ResizeObserver(() =>
      setWidth(ref.current?.firstElementChild?.clientWidth)
    )
    if (ref.current?.firstElementChild) {
      observer.observe(ref.current.firstElementChild)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref])

  // determine if toolbar should be displayed
  React.useEffect(() => {
    const overflowStatus =
      Math.abs(
        (ref.current?.firstElementChild as HTMLDivElement)?.offsetWidth -
          (ref.current?.firstElementChild?.scrollWidth || 0)
      ) > 1

    setOverflow(overflowStatus)
  }, [ref, width])

  return (
    <TooltippedDiv ref={ref} style={style}>
      {overflow ? <Tooltip title={tooltip}>{children}</Tooltip> : children}
    </TooltippedDiv>
  )
}
