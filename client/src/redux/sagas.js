import { delay, put, call, takeEvery, all, select } from 'redux-saga/effects'
import {
  ASYNC_INCREMENT,
  ASYNC_DECREMENT,
  INCREMENT,
  DECREMENT,
  WILL_INCREMENT,
  FINISHED_ASYNC,
  FAILED_ASYNC
} from './actionTypes'

// watcher sagas
function* watchIncrementAsync() {
  console.log('watched')
  yield takeEvery(ASYNC_INCREMENT, incrementAsync)
}

function* watchDecrementAsync() {
  yield takeEvery(ASYNC_DECREMENT, decrementAsync)
}

function throwOn4(current) {
  if (current.counterCount === 4) {
    throw new Error()
  }
}

//Worker sagas
function* incrementAsync() {
  try {
    yield put({ type: WILL_INCREMENT })
    yield delay(1500)
    yield put({ type: INCREMENT })
    yield call(throwOn4, yield select(state => state.counter))
    yield put({ type: FINISHED_ASYNC })
  } catch (e) {
    yield put({ type: DECREMENT })
    yield put({ type: FAILED_ASYNC })
    yield delay(500)
    yield put({ type: FINISHED_ASYNC })
  }
}

function* decrementAsync() {
  yield delay(1500)
  yield put({ type: DECREMENT })
}

function* sagas() {
  yield all([watchIncrementAsync(), watchDecrementAsync()])
}

export default sagas
