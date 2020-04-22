import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import sagas from './sagas'

const sagaMiddleware = createSagaMiddleware()
const preloadedState = { auth: { autenticated: localStorage.getItem('token') } }
const store = createStore(
  rootReducer,
  preloadedState,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(sagas)

export default store
