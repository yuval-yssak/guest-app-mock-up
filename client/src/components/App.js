import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import Counter from './CounterExample'
import Welcome from './Welcome'
import Feature from './Feature'
import Signout from './Signout'
import Signin from './Signin'
import Signup from './Signup'
import Header from './Header'

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <main>
          <Switch>
            <Route path='/' exact>
              <Redirect to='/welcome' />
            </Route>
            <Route path='/welcome' component={Welcome} />
            <Route path='/signup' component={Signup} />
            <Route path='/feature' component={Feature} />
            <Route path='/signout' component={Signout} />
            <Route path='/signin' component={Signin} />
            <Route path='/counter' component={Counter} />
          </Switch>
        </main>
      </Router>
    </>
  )
}
