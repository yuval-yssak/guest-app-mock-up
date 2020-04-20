import { INCREMENT, DECREMENT, SET_COUNT } from '../actionTypes'

const initialState = 0

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT: {
      return state + 1
    }
    case DECREMENT: {
      return state - 1
    }
    case SET_COUNT: {
      return action.payload.newCount
    }
    default:
      return state
  }
}

export default counterReducer
