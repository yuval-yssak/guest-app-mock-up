import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { increment, decrement, setCount } from '../redux/actions'

function CounterExample() {
  const [localSetCount, setLocalSetCount] = useState(10)
  const counter = useSelector(state => state.counter)
  const dispatch = useDispatch()
  return (
    <>
      <p>Counter: {counter}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
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
