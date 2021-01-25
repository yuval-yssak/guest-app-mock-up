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
import SimpleBottomNavigation from './SimpleBottomNavigation'

const Main = styled.main`
  display: grid;
  align-items: center;
  justify-items: center;
`
const StyledPaper = styled(Paper)`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr min-content;
`

const StyledBox = styled.div`
  perspective: 35rem;
`

const StyledP = styled.p`
  padding: 2rem;
  color: white;
  font-weight: 800;
  font-size: 3rem;
  border: 1px solid darkred;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
  transition: all 0.8s ease-in-out;
  box-shadow: 0 0.2rem 0.3rem rgba(0, 0, 0, 0.2);

  &:hover {
    transform: rotateY(180deg);
  }
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
          <StyledPaper square>
            <Switch
              darkTheme={darkTheme}
              onThemeChange={() => setDarkTheme(!darkTheme)}
            />
            <Main>
              <FloatingActionButtons />
              <StyledBox>
                <StyledP>Hello World</StyledP>
              </StyledBox>
            </Main>
            <SimpleBottomNavigation />
          </StyledPaper>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
