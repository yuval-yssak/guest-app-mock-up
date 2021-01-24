import React from 'react'

import styled from 'styled-components'

import CssReset from './CssReset'

const Main = styled.main`
  display: grid;
  height: 100vh;
  align-items: center;
  justify-items: center;
`

const StyledP = styled.p`
  padding: 2rem;
  color: olive;
  border: 1px solid darkred;
  border-radius: 0.5rem;
`

export default function App() {
  return (
    <>
      <CssReset />
      <Main>
        <StyledP>Hello World</StyledP>
      </Main>
    </>
  )
}
