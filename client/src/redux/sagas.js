import { put, call, takeEvery, all, select } from 'redux-saga/effects'
import {
  INCREMENT,
  INCREMENT_ASYNC,
  DECREMENT,
  DECREMENT_ASYNC,
  WILL_INCREMENT,
  FINISHED_ASYNC,
  FAILED_ASYNC
} from './actionTypes'
const delay = ms => new Promise(res => setTimeout(res, ms))

// watcher sagas
function* watchIncrementAsync() {
  console.log('watched')
  yield takeEvery(INCREMENT_ASYNC, incrementAsync)
}

function* watchDecrementAsync() {
  yield takeEvery(DECREMENT_ASYNC, decrementAsync)
}

//Worker sagas
function* incrementAsync() {
  try {
    yield put({ type: WILL_INCREMENT })
    yield call(delay, 2000)
    yield put({ type: INCREMENT })
    const current = yield select(state => state.counter)
    if (current.counterCount === 4) {
      throw new Error()
    }
    yield put({ type: FINISHED_ASYNC })
  } catch (e) {
    yield put({ type: DECREMENT })
    yield put({ type: FAILED_ASYNC })
    yield call(delay, 500)
    yield put({ type: FINISHED_ASYNC })
  }
}

function* decrementAsync() {
  yield call(delay, 2000)
  yield put({ type: DECREMENT })
}

function* sagas() {
  yield all([watchIncrementAsync(), watchDecrementAsync()])
}

export default sagas
