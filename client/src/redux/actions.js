import {
  INCREMENT,
  ASYNC_INCREMENT,
  DECREMENT,
  SET_COUNT,
  CANCEL_ASYNC_CHANGE
} from './actionTypes'

const increment = () => ({ type: INCREMENT })
const incrementAsync = () => ({ type: ASYNC_INCREMENT })
const decrement = () => ({ type: DECREMENT })
const setCount = count => ({ type: SET_COUNT, payload: { newCount: count } })
const cancelAsync = () => ({ type: CANCEL_ASYNC_CHANGE })
export { increment, decrement, incrementAsync, setCount, cancelAsync }
