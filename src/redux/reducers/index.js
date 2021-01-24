import { combineReducers } from 'redux'
import counter from './counter.js'
import auth from './auth.js'
export default combineReducers({ counter, auth })
