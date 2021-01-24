import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import './HeaderStyle.css'

function Header() {
  const authenticated = useSelector(state => state.auth.authenticated)

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/welcome">Welcome</Link>
          </li>
          {authenticated ? (
            <>
              <li>
                <Link to="/signout">Sign Out</Link>
              </li>
              <li>
                <Link to="/feature">Feature</Link>
              </li>
            </>
          ) : (
            <div>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
            </div>
          )}
          <li>
            <Link to="/counter">Counter Redux Saga Example</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
