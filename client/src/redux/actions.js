import { INCREMENT, ASYNC_INCREMENT, DECREMENT, SET_COUNT } from './actionTypes'

const increment = () => ({ type: INCREMENT })
const incrementAsync = () => ({ type: ASYNC_INCREMENT })
const decrement = () => ({ type: DECREMENT })
const setCount = count => ({ type: SET_COUNT, payload: { newCount: count } })

export { increment, decrement, incrementAsync, setCount }
