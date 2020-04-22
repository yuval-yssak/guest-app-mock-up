import {
  take,
  delay,
  put,
  fork,
  call,
  select,
  cancel,
  cancelled
} from 'redux-saga/effects'
import {
  ASYNC_INCREMENT,
  ASYNC_DECREMENT,
  CANCEL_ASYNC_CHANGE,
  INCREMENT,
  DECREMENT,
  WILL_INCREMENT,
  FINISHED_ASYNC,
  FAILED_ASYNC
} from './actionTypes'

function throwOn4(current) {
  if (current.counterCount === 4) {
    throw new Error()
  }
}

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
  } finally {
    if (yield cancelled()) yield put({ type: FINISHED_ASYNC })
  }
}

function* decrementAsync() {
  try {
    yield put({ type: WILL_DECREMENT })
    yield delay(1500)
    yield put({ type: DECREMENT })
    yield put({ type: FINISHED_ASYNC })
  } catch (e) {
    yield put({ type: INCREMENT })
    yield put({ type: FAILED_ASYNC })
    yield delay(500)
    yield put({ type: FINISHED_ASYNC })
  } finally {
    if (yield cancelled()) yield put({ type: FINISHED_ASYNC })
  }
}

function* sagas() {
  while (true) {
    const action = yield take([ASYNC_INCREMENT, ASYNC_DECREMENT])
    const task = yield fork(
      action.type === ASYNC_INCREMENT ? incrementAsync : decrementAsync
    )

    const finishAction = yield take([FINISHED_ASYNC, CANCEL_ASYNC_CHANGE])
    if (finishAction.type === CANCEL_ASYNC_CHANGE) {
      yield cancel(task)
    }
  }
}

export default sagas
