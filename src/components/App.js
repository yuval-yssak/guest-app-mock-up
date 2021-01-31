import React from 'react'

import styled, { ThemeProvider, keyframes } from 'styled-components'
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

const scaleFrom0 = keyframes`
0% {
  transform:scale(0);
}

100% {
  transform:scale(1);
}`

const dance = keyframes`
0% {
  transform: translateY(0) rotate(0);
}

70% {
  transform: translateY(-2rem) rotate(20deg);
}

100% {
  transform: translateY(0) rotate(0);
}
`

const Background = styled.div.attrs({ className: 'background' })`
  height: 100%;
  position: relative;
  overflow-y: hidden;

  &::before {
    content: '';
    position: absolute;
    background-image: url(./logo.svg);
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    animation: ${scaleFrom0} 1.6s cubic-bezier(0.83, 0, 0.17, 1);
    transition: opacity 1s cubic-bezier(0.83, 0, 0.17, 1);
    opacity: 0.1;
  }
`

const AnimatedBottomNavigation = styled(SimpleBottomNavigation)`
  & button:nth-of-type(1) {
    animation: ${dance} 0.15s 1s;
  }
  & button:nth-of-type(2) {
    animation: ${dance} 0.15s 1.35s;
  }
  & button:nth-of-type(3) {
    animation: ${dance} 0.15s 1.5s;
  }

  & button {
    transition: transform 0.2s cubic-bezier(0.37, 0, 0.63, 1);
    @media (hover: hover) {
      &:hover {
        transform: scale(1.05);
      }
    }
  }
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

  function getPageTitle() {
    switch (content) {
      case 'root':
        return 'Root'
      case 'announcements':
        return 'Announcements'
      case 'chat':
        return 'Chat'
      case 'info-section':
        return 'Info Section'
      case 'map':
        return 'Ashram Map'
      case 'my-bookings':
        return 'My Bookings'
      case 'settings':
        return 'Settings'
      case 'activities':
        return 'Activities'
      default:
        return 'No Title...'
    }
  }
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
            <AppBar toggleDrawer={toggleDrawer} pageTitle={getPageTitle()} />
            <Background>
              <Main>
                {content === 'root' && <FloatingActionButtons />}
                {content === 'announcements' && <AnnouncementsPage />}
                {content === 'chat' && <ChatPage />}
                {content === 'info-section' && <div>Info Section Pages</div>}
                {content === 'map' && <div>Map</div>}
                {content === 'my-bookings' && <div>Account Details Page</div>}
                {content === 'settings' && (
                  <SettingsPage
                    darkTheme={darkTheme}
                    setDarkTheme={setDarkTheme}
                  />
                )}
                {content === 'activities' && <div>Activities Page</div>}
              </Main>
            </Background>
            <AnimatedBottomNavigation openPage={openPage} />
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
