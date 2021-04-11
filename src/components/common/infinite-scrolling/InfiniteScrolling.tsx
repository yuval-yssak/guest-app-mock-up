import React, { ReactNode, CSSProperties } from 'react'
import { throttle } from 'throttle-debounce'
import { usePrevious } from '../../../hooks/usePrevious'
import { ThresholdUnits, parseThreshold } from './threshold'

type Fn = () => any
export interface Props {
  next: Fn
  hasMore: boolean
  children: ReactNode
  loader: ReactNode
  scrollThreshold?: number | string
  endMessage?: ReactNode
  style?: CSSProperties
  height?: number | string
  scrollableTarget?: ReactNode
  hasChildren?: boolean
  inverse?: boolean
  pullDownToRefresh?: boolean
  pullDownToRefreshContent?: ReactNode
  releaseToRefreshContent?: ReactNode
  pullDownToRefreshThreshold?: number
  refreshFunction?: Fn
  onScroll?: (e: MouseEvent) => any
  dataLength: number
  initialScrollY?: number
  className?: string
}

export default function InfiniteScroll(props: Props) {
  const [showLoader, setShowLoader] = React.useState(false)
  const [
    pullToRefreshThresholdBreached,
    setPullToRefreshThresholdBreached
  ] = React.useState(false)

  const throttledOnScrollListener: (e: MouseEvent) => void = throttle(
    150,
    onScrollListener
  )

  const el = React.useRef<
    HTMLElement | undefined | (Window & typeof globalThis)
  >()
  const _scrollableNode = React.useRef<HTMLElement | undefined | null>()
  const _infScroll = React.useRef<HTMLDivElement | undefined>()
  let lastScrollTop = 0
  const [actionTriggered, setActionTriggered] = React.useState(false)
  const _pullDown = React.useRef<HTMLDivElement | undefined>()

  // variables to keep track of pull down behaviour
  let startY = 0
  let currentY = 0
  let dragging = false

  // will be populated in componentDidMount
  // based on the height of the pull down element
  let maxPullDownDistance = 0
  const [_, forceUpdate] = React.useReducer(x => x + 1, 0)

  React.useEffect(() => {
    if (typeof props.dataLength === 'undefined') {
      throw new Error(
        `mandatory prop "dataLength" is missing. The prop is needed` +
          ` when loading more content. Check README.md for usage`
      )
    }

    _scrollableNode.current = getScrollableTarget()
    el.current = props.height
      ? _infScroll.current
      : _scrollableNode.current || window

    if (el.current) {
      el.current.addEventListener(
        'scroll',
        throttledOnScrollListener as EventListenerOrEventListenerObject
      )
    }

    if (
      typeof props.initialScrollY === 'number' &&
      el.current &&
      el.current instanceof HTMLElement &&
      el.current.scrollHeight > props.initialScrollY
    ) {
      el.current.scrollTo(0, props.initialScrollY)
    }

    if (props.pullDownToRefresh && el.current) {
      el.current.addEventListener('touchstart', onStart)
      el.current.addEventListener('touchmove', onMove)
      el.current.addEventListener('touchend', onEnd)

      el.current.addEventListener('mousedown', onStart)
      el.current.addEventListener('mousemove', onMove)
      el.current.addEventListener('mouseup', onEnd)

      // get BCR of pullDown element to position it above
      maxPullDownDistance =
        (_pullDown.current &&
          _pullDown.current.firstChild &&
          (_pullDown.current
            .firstChild as HTMLDivElement).getBoundingClientRect().height) ||
        0

      forceUpdate()

      if (typeof props.refreshFunction !== 'function') {
        throw new Error(
          `Mandatory prop "refreshFunction" missing.
          Pull Down To Refresh functionality will not work
          as expected. Check README.md for usage'`
        )
      }
    }

    return function () {
      if (el.current) {
        el.current.removeEventListener(
          'scroll',
          throttledOnScrollListener as EventListenerOrEventListenerObject
        )

        if (props.pullDownToRefresh) {
          el.current.removeEventListener('touchstart', onStart)
          el.current.removeEventListener('touchmove', onMove)
          el.current.removeEventListener('touchend', onEnd)

          el.current.removeEventListener('mousedown', onStart)
          el.current.removeEventListener('mousemove', onMove)
          el.current.removeEventListener('mouseup', onEnd)
        }
      }
    }
  }, [])

  const previousDataLength = usePrevious(props.dataLength)
  React.useLayoutEffect(() => {
    if (props.dataLength !== previousDataLength) {
      setActionTriggered(false)
      setShowLoader(false)
    } else {
      console.warn("checkout - data length changed but didn't change really...")
    }
  }, [props.dataLength, previousDataLength])

  const getScrollableTarget = () => {
    if (props.scrollableTarget instanceof HTMLElement)
      return props.scrollableTarget
    if (typeof props.scrollableTarget === 'string') {
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

  const onStart: EventListener = (evt: Event) => {
    if (lastScrollTop) return

    dragging = true

    if (evt instanceof MouseEvent) {
      startY = evt.pageY
    } else if (evt instanceof TouchEvent) {
      startY = evt.touches[0].pageY
    }
    currentY = startY

    if (_infScroll.current) {
      _infScroll.current.style.willChange = 'transform'
      _infScroll.current.style.transition = `transform 0.2s cubic-bezier(0,0,0.31,1)`
    }
  }

  const onMove: EventListener = (evt: Event) => {
    if (!dragging) return

    if (evt instanceof MouseEvent) {
      currentY = evt.pageY
    } else if (evt instanceof TouchEvent) {
      currentY = evt.touches[0].pageY
    }

    // user is scrolling down to up
    if (currentY < startY) return

    if (currentY - startY >= Number(props.pullDownToRefreshThreshold)) {
      setPullToRefreshThresholdBreached(true)
    }

    // so you can drag upto 1.5 times of the maxPullDownDistance
    if (currentY - startY > maxPullDownDistance * 1.5) return

    if (_infScroll.current) {
      _infScroll.current.style.overflow = 'visible'
      _infScroll.current.style.transform = `translate3d(0px, ${
        currentY - startY
      }px, 0px)`
    }
  }

  const onEnd: EventListener = () => {
    startY = 0
    currentY = 0

    dragging = false

    if (pullToRefreshThresholdBreached) {
      props.refreshFunction?.()
      setPullToRefreshThresholdBreached(false)
    }

    requestAnimationFrame(() => {
      // _infScroll.current
      if (_infScroll.current) {
        _infScroll.current.style.overflow = 'auto'
        _infScroll.current.style.transform = 'none'
        _infScroll.current.style.willChange = 'unset'
      }
    })
  }

  function isElementAtTop(
    target: HTMLElement,
    scrollThreshold: string | number = 0.9
  ) {
    const threshold = parseThreshold(scrollThreshold)

    if (threshold.unit === ThresholdUnits.Pixel) {
      return target.scrollTop <= threshold.value + 1
    }

    return target.scrollTop <= threshold.value / 100 + 1
  }

  function isElementAtBottom(
    target: HTMLElement,
    scrollThreshold: string | number = 0.95
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

  function onScrollListener(event: MouseEvent) {
    if (typeof props.onScroll === 'function') {
      // Execute this callback in next tick so that it does not affect the
      // functionality of the library.
      setTimeout(() => props.onScroll && props.onScroll(event), 0)
    }

    const target =
      props.height || _scrollableNode.current
        ? (event.target as HTMLElement)
        : document.documentElement.scrollTop
        ? document.documentElement
        : document.body

    // return immediately if the action has already been triggered,
    // prevents multiple triggers.
    if (actionTriggered) return

    const atBottom = props.inverse
      ? isElementAtTop(target, props.scrollThreshold)
      : isElementAtBottom(target, props.scrollThreshold)

    // call the `next` function in the props to trigger the next data fetch
    if (atBottom && props.hasMore) {
      setActionTriggered(true)
      setShowLoader(true)
      props?.next()
    }

    lastScrollTop = target.scrollTop
  }

  const style = {
    height: props.height || 'auto',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    ...props.style
  } as CSSProperties
  const hasChildren =
    props.hasChildren ||
    !!(
      props.children &&
      props.children instanceof Array &&
      props.children.length
    )

  // because heighted infiniteScroll visualy breaks
  // on drag down as overflow becomes visible
  const outerDivStyle =
    props.pullDownToRefresh && props.height ? { overflow: 'auto' } : {}
  return (
    <div style={outerDivStyle} className="infinite-scroll-component__outerdiv">
      <div
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

        {props.pullDownToRefresh && (
          <div
            style={{ position: 'relative' }}
            ref={(pullDown: HTMLDivElement) => (_pullDown.current = pullDown)}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: -1 * maxPullDownDistance
              }}
            >
              {pullToRefreshThresholdBreached
                ? props.releaseToRefreshContent
                : props.pullDownToRefreshContent}
            </div>
          </div>
        )}
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
