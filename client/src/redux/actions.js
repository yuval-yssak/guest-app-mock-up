import { INCREMENT, INCREMENT_ASYNC, DECREMENT, SET_COUNT } from './actionTypes'

const increment = () => ({ type: INCREMENT })
const incrementAsync = () => ({ type: INCREMENT_ASYNC })
const decrement = () => ({ type: DECREMENT })
const setCount = count => ({ type: SET_COUNT, payload: { newCount: count } })

export { increment, decrement, incrementAsync, setCount }
