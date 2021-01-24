import React from 'react'

import styled, { ThemeProvider } from 'styled-components'
import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
import CssReset from './CssReset'

import FloatingActionButtons from './FloatingActionButton'

const Main = styled.main`
  display: grid;
  height: 100vh;
  align-items: center;
  justify-items: center;
`

const StyledP = styled.p`
  padding: 2rem;
  color: white;
  font-weight: 800;
  border: 1px solid darkred;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
`

export default function App() {
  const customTheme = createMuiTheme({
    palette: { primary: { main: '#f29500' }, secondary: { main: '#ffcf00' } },
    typography: {
      fontFamily: ['Gotham Rounded SSm Aa', 'Arial', 'Helvetica', 'sans-serif']
    }
  })

  return (
    <>
      <CssReset />
      <MuiThemeProvider theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <Main>
            <FloatingActionButtons />
            <StyledP>Hello World</StyledP>
          </Main>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
