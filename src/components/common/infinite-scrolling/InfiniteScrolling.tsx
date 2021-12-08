import * as React from 'react'
import { usePrevious } from '../../../hooks/usePrevious'
import { ThresholdUnits, parseThreshold } from './threshold'

type Fn = () => void
export interface Props {
  next: Fn
  hasMore: boolean
  children: React.ReactNode
  loader: React.ReactNode
  scrollThreshold?: number | string
  endMessage?: React.ReactNode
  style?: React.CSSProperties
  scrollableTarget?: React.ReactNode
  inverse?: boolean
  refreshFunction?: Fn
  onScroll?: (e: MouseEvent) => void
  dataLength: number
  initialScrollY?: number
  className?: string
  keysScroll?: boolean
}

export default function InfiniteScroll(props: Props) {
  const [showLoader, setShowLoader] = React.useState(false)

  const theRefToElement = React.useRef<
    HTMLElement | undefined | (Window & typeof globalThis)
  >()
  const _scrollableNode = React.useRef<HTMLElement | undefined | null>()
  const _infScroll = React.useRef<HTMLDivElement | undefined>()
  const lastScrollTop = React.useRef(0)
  const [actionTriggered, setActionTriggered] = React.useState(false)
  const lastScrollHeight = React.useRef(0)

  React.useEffect(() => {
    if (typeof props.dataLength === 'undefined') {
      throw new Error(
        `mandatory prop "dataLength" is missing. The prop is needed` +
          ` when loading more content. Check README.md for usage`
      )
    }
  }, [props.dataLength])

  const { scrollThreshold, onScroll, inverse, hasMore, next } = props
  const onScrollListener = React.useCallback(
    function (evt: MouseEvent) {
      if (typeof onScroll === 'function') {
        // Execute this callback in next tick so that it does not affect the
        // functionality of the library.
        setTimeout(() => onScroll && onScroll(evt), 0)
      }

      const target = _scrollableNode.current
        ? (evt.target as HTMLElement)
        : document.documentElement.scrollTop
        ? document.documentElement
        : document.body

      // return immediately if the action has already been triggered,
      // prevents multiple triggers.
      if (!actionTriggered) {
        const atBottom = inverse
          ? isElementAtTop(target, scrollThreshold)
          : isElementAtBottom(target, scrollThreshold)

        // call the `next` function in the props to trigger the next data fetch
        if (atBottom && hasMore) {
          setActionTriggered(true)
          setShowLoader(true)
          lastScrollHeight.current = (
            theRefToElement.current as Element
          ).scrollHeight
          next()
        }
      }
      lastScrollTop.current = target.scrollTop
    },
    [scrollThreshold, actionTriggered, hasMore, inverse, onScroll, next]
  )

  React.useEffect(() => {
    function getScrollableTarget() {
      if (props.scrollableTarget instanceof HTMLElement) {
        console.log('getScrollableTarget returns', props.scrollableTarget)
        return props.scrollableTarget
      }
      if (typeof props.scrollableTarget === 'string') {
        console.log(
          'getScrollableTarget returns from string',
          document.getElementById(props.scrollableTarget)
        )
        return document.getElementById(props.scrollableTarget)
      }
      if (props.scrollableTarget === null) {
        console.warn(`You are trying to pass scrollableTarget but it is null. This might
          happen because the element may not have been added to DOM yet.
          See https://github.com/ankeetmaini/react-infinite-scroll-component/issues/59 for more info.
        `)
      }
      return null
    }

    _scrollableNode.current = getScrollableTarget()
    console.log('_scrollableNode = ', _scrollableNode.current)
    theRefToElement.current = _scrollableNode.current || window
    console.log('init scroll listener', theRefToElement.current)
    if (theRefToElement.current) {
      theRefToElement.current.addEventListener(
        'scroll',
        onScrollListener as EventListenerOrEventListenerObject
      )
    }
    return () => {
      if (theRefToElement.current) {
        theRefToElement.current.removeEventListener(
          'scroll',
          onScrollListener as EventListenerOrEventListenerObject
        )
      }
    }
  }, [onScrollListener, props.scrollableTarget])

  React.useEffect(() => {
    if (
      typeof props.initialScrollY === 'number' &&
      theRefToElement.current &&
      theRefToElement.current instanceof HTMLElement &&
      theRefToElement.current.scrollHeight > props.initialScrollY
    ) {
      theRefToElement.current.scrollTo(0, props.initialScrollY)
    }
  }, [props.initialScrollY])

  const previousDataLength = usePrevious(props.dataLength)
  React.useLayoutEffect(() => {
    if (props.dataLength !== previousDataLength) {
      setActionTriggered(false)
      if (props.inverse && theRefToElement.current) {
        ;(theRefToElement.current as Element).scrollTop =
          (theRefToElement.current as Element).scrollHeight -
          lastScrollHeight.current +
          lastScrollTop.current
      }

      setShowLoader(false)
    }
  }, [props.dataLength, previousDataLength, props.inverse, lastScrollHeight])

  function isElementAtTop(
    target: HTMLElement,
    scrollThreshold: string | number = 0.85
  ) {
    const threshold = parseThreshold(scrollThreshold)

    if (threshold.unit === ThresholdUnits.Pixel) {
      return target.scrollTop <= threshold.value + 1
    }

    return target.scrollTop / target.clientHeight <= threshold.value / 100
  }

  function isElementAtBottom(
    target: HTMLElement,
    scrollThreshold: string | number = 0.85
  ) {
    const clientHeight =
      target === document.body || target === document.documentElement
        ? window.screen.availHeight
        : target.clientHeight

    const threshold = parseThreshold(scrollThreshold)

    if (threshold.unit === ThresholdUnits.Pixel) {
      return (
        target.scrollTop + clientHeight >= target.scrollHeight - threshold.value
      )
    }

    return (
      target.scrollTop + clientHeight >=
      (threshold.value / 100) * target.scrollHeight
    )
  }

  const style = {
    height: 'auto',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...props.style
  } as React.CSSProperties
  const hasChildren = !!(
    props.children &&
    props.children instanceof Array &&
    props.children.length
  )

  const outerDivStyle = {}
  return (
    <div
      style={outerDivStyle}
      className={`infinite-scroll-component__outerdiv ${props.className || ''}`}
    >
      <div
        tabIndex={props.keysScroll ? 0 : undefined}
        className={`infinite-scroll-component ${props.className || ''}`}
        ref={(infScroll: HTMLDivElement) => (_infScroll.current = infScroll)}
        style={style}
      >
        {props.inverse &&
          !showLoader &&
          !hasChildren &&
          props.hasMore &&
          props.loader}
        {props.inverse && showLoader && props.hasMore && props.loader}

        {props.children}
        {!props.inverse &&
          !showLoader &&
          !hasChildren &&
          props.hasMore &&
          props.loader}
        {!props.inverse && showLoader && props.hasMore && props.loader}
        {!props.hasMore && props.endMessage}
      </div>
    </div>
  )
}
