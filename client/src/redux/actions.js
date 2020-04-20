import {
  INCREMENT,
  INCREMENT_IN_A_DELAY,
  DECREMENT,
  SET_COUNT
} from './actionTypes'

const increment = () => ({ type: INCREMENT })
const incrementInADelay = () => ({ type: INCREMENT })
const decrement = () => ({ type: DECREMENT })
const setCount = count => ({ type: SET_COUNT, payload: { newCount: count } })

export { increment, decrement, incrementInADelay, setCount }
