export const INCREMENT = 'INCREMENT'
export const ASYNC_INCREMENT = 'ASYNC_INCREMENT'
export const DECREMENT = 'DECREMENT'
export const ASYNC_DECREMENT = 'ASYNC_DECREMENT'
export const SET_COUNT = 'SET_COUNT'
export const WILL_INCREMENT = 'WILL_INCREMENT'
export const FINISHED_ASYNC = 'FINISHED_ASYNC'
export const FAILED_ASYNC = 'FAILED_ASYNC'
export const CANCEL_ASYNC_CHANGE = 'CANCEL_ASYNC_CHANGE'

export const increment = () => ({ type: INCREMENT })
export const incrementAsync = () => ({ type: ASYNC_INCREMENT })
export const decrement = () => ({ type: DECREMENT })
export const setCount = count => ({
  type: SET_COUNT,
  payload: { newCount: count }
})
export const cancelAsync = () => ({ type: CANCEL_ASYNC_CHANGE })
