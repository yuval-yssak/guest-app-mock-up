import {
  INCREMENT,
  DECREMENT,
  SET_COUNT,
  WILL_INCREMENT,
  FINISHED_ASYNC,
  FAILED_ASYNC
} from '../actions'

const initialState = { counterCount: 0, text: '' }

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT: {
      return { ...state, counterCount: state.counterCount + 1 }
    }
    case DECREMENT: {
      return { ...state, counterCount: state.counterCount - 1 }
    }
    case SET_COUNT: {
      return { ...state, counterCount: action.payload.newCount }
    }
    case WILL_INCREMENT: {
      return { ...state, text: 'About to increment' }
    }
    case FAILED_ASYNC: {
      return { ...state, text: 'failed' }
    }
    case FINISHED_ASYNC: {
      return { ...state, text: '' }
    }
    default:
      return state
  }
}

export default counterReducer
