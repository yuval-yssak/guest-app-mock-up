import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  increment,
  incrementAsync,
  decrement,
  setCount
} from '../redux/actions'

function CounterExample() {
  const [localSetCount, setLocalSetCount] = useState(10)
  const counter = useSelector(state => state.counter.counterCount)
  const text = useSelector(state => state.counter.text)
  console.log(text)
  const dispatch = useDispatch()
  return (
    <>
      <p>
        Counter: {counter}. {text}
      </p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(incrementAsync())}>
        Increment in two seconds
      </button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(setCount(localSetCount))}>
        Set to:{' '}
      </button>
      <input
        type='text'
        value={localSetCount}
        onChange={e => setLocalSetCount(+e.target.value)}
      ></input>
    </>
  )
}

export default CounterExample
