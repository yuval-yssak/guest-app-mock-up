import React from 'react'

import styled, { ThemeProvider } from 'styled-components'
import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
import CssReset from './CssReset'

import FloatingActionButtons from './FloatingActionButton'
import Paper from '@material-ui/core/Paper'
import Switch from './Switch'

const Main = styled.main`
  display: grid;
  height: 100vh;
  align-items: center;
  justify-items: center;
`
const StyledPaper = styled(Paper)`
  width: 100%;
  height: 100%;
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
  const [darkTheme, setDarkTheme] = React.useState(false)
  const customTheme = createMuiTheme({
    palette: {
      type: darkTheme ? 'dark' : 'light',
      primary: { main: '#f29500' },
      secondary: { main: '#ffcf00' }
    },
    typography: {
      fontFamily: ['Gotham Rounded SSm Aa', 'Arial', 'Helvetica', 'sans-serif']
    }
  })

  return (
    <>
      <CssReset />
      <MuiThemeProvider theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <StyledPaper>
            <Switch
              darkTheme={darkTheme}
              onThemeChange={() => setDarkTheme(!darkTheme)}
            />
            <Main>
              <FloatingActionButtons />
              <StyledP>Hello World</StyledP>
            </Main>
          </StyledPaper>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
