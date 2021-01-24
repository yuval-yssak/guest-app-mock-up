import React from 'react'

import styled, { ThemeProvider } from 'styled-components'
import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
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
  background-color: ${({ theme }) => theme.palette.primary.main};
`

export default function App() {
  const customTheme = createMuiTheme({
    palette: { primary: { main: false ? '#fff' : '#F8BBD0' } }
  })

  return (
    <>
      <CssReset />
      <MuiThemeProvider theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <Main>
            <StyledP>Hello World</StyledP>
          </Main>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
