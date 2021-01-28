import React from 'react'

import styled, { ThemeProvider } from 'styled-components'
import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'
import CssReset from './CssReset'

import FloatingActionButtons from './FloatingActionButton'
import Paper from '@material-ui/core/Paper'
import SimpleBottomNavigation from './SimpleBottomNavigation'
import AppBar from './AppBar'
import TemporaryDrawer from './Drawer'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import SettingsPage from '../pages/SettingsPage'
import ChatPage from '../pages/ChatPage'

const Background = styled.div.attrs({ className: 'background' })`
  height: 100%;
  position: relative;
  overflow-y: hidden;

  &::before {
    content: '';
    position: absolute;
    background-image: url(./logo.svg);
    background-size: 100% 100%;
    filter: opacity(0.07);
    width: 100%;
    height: 100%;
  }
`

const Scrollable = styled.div.attrs({ className: 'scrollable' })`
  overflow-y: scroll;
  height: 100%;
`

const Main = styled.main`
  display: grid;
  align-items: center;
  justify-items: center;
  position: relative;
  height: 100%;
`

const StyledPaper = styled(Paper)`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr min-content;
`

export default function App() {
  const [darkTheme, setDarkTheme] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [content, setContent] = React.useState('root')
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

  function openPage(pageName) {
    setContent(pageName)
    setOpen(false)
  }

  const toggleDrawer = open => event => {
    if (
      event.type === 'keydown' &&
      ['Tab', 'Shift', 'Space', 'Enter'].some(k => k === event.key)
    ) {
      return
    }
    setOpen(open)
  }

  return (
    <>
      <CssReset />
      <MuiThemeProvider theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <StyledPaper square>
            <AppBar toggleDrawer={toggleDrawer} />
            <Background>
              <Scrollable>
                <Main>
                  {content === 'root' && <FloatingActionButtons />}
                  {content === 'announcements' && <AnnouncementsPage />}
                  {content === 'chat' && <ChatPage />}
                  {content === 'info-section' && <div>Info Section Pages</div>}
                  {content === 'account-details' && (
                    <div>Account Details Page</div>
                  )}
                  {content === 'settings' && (
                    <SettingsPage
                      darkTheme={darkTheme}
                      setDarkTheme={setDarkTheme}
                    />
                  )}
                  {content === 'activities' && <div>Activities Page</div>}
                </Main>
              </Scrollable>
            </Background>
            <SimpleBottomNavigation />
          </StyledPaper>
          <TemporaryDrawer
            open={open}
            toggleDrawer={toggleDrawer}
            openPage={openPage}
          />
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}
