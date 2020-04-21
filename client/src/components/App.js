import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Counter from './CounterExample'

export default function App() {
  return (
    <Router>
      <header>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/counter'>Counter Redux Saga Example</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Switch>
          <Route path='/about'>
            <About />
          </Route>
          <Route path='/counter'>
            <Counter />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  )
}

function Home() {
  return <h2>Home</h2>
}

function About() {
  return <h2>About</h2>
}
