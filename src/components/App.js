import React from 'react'

import styled, { ThemeProvider, keyframes } from 'styled-components'
import {
  ThemeProvider as MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core'

import { observer } from 'mobx-react-lite'
import CssReset from './CssReset'

import MainBottomNavigation from './SimpleBottomNavigation'
import AppBar from './AppBar'
import TemporaryDrawer from './Drawer'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import SettingsPage from '../pages/SettingsPage'
import ChatPage from '../pages/ChatPage'
import InfoSectionPage from '../pages/InfoPages/InfoSectionPage'
import { useMst } from '../models/reactHook'

const scaleFrom0 = keyframes`
0% {
  transform:scale(0);
}

100% {
  transform:scale(1);
}`

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
    opacity: ${({ theme }) => (theme.palette.type === 'dark' ? 0.08 : 0.1)};
  }
`

const AnimatedBottomNavigation = styled(MainBottomNavigation)`
  & button {
    transition: transform 0.2s cubic-bezier(0.37, 0, 0.63, 1);
    @media (hover: hover) {
      &:hover {
        /* transform: scale(1.05); */
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

const AppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: min-content 1fr min-content;
`

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const mainRef = React.createRef()
  const store = useMst()

  // todo:
  // focus on main (content area) once the page is switched over.
  //
  // This means that the user while hitting the tab key will bring the focus
  // into the first focusable element within the content area.

  function getPageTitle() {
    switch (store.view.page) {
      case '/':
        return 'Root'
      case '/announcements':
        return 'Announcements'
      case '/chat':
        return 'Chat'
      case '/info-section':
        return 'Info Section'
      case '/map':
        return 'Ashram Map'
      case '/my-bookings':
        return 'My Bookings'
      case '/settings':
        return 'Settings'
      case '/activities':
        return 'Activities'
      default:
        return 'No Title...'
    }
  }

  const customTheme = createMuiTheme({
    palette: {
      type: store.preferences.darkMode ? 'dark' : 'light',
      primary: { main: '#f29500' },
      secondary: { main: '#ffcf00' }
    },
    typography: {
      fontFamily: ['Gotham Rounded SSm Aa', 'Arial', 'Helvetica', 'sans-serif']
    }
  })

  const toggleDrawer = open => event => {
    if (
      event.type === 'keydown' &&
      ['Tab', 'Shift', 'Space', 'Enter'].some(k => k === event.key)
    ) {
      return
    }
    setDrawerOpen(open)
  }

  return (
    <>
      <CssReset />
      <MuiThemeProvider theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <AppWrapper square>
            <AppBar toggleDrawer={toggleDrawer} pageTitle={getPageTitle()} />
            <Background>
              <Main ref={mainRef} tabIndex={-1}>
                {store.view.page === '/root' && <h1>Dashboard</h1>}
                {store.view.page === '/announcements' && <AnnouncementsPage />}
                {store.view.page === '/chat' && <ChatPage />}
                {store.view.page === '/info-section' && (
                  <InfoSectionPage page={store.view.id} />
                )}
                {store.view.page === '/map' && <div>Map</div>}
                {store.view.page === '/my-bookings' && (
                  <div>Account Details Page</div>
                )}
                {store.view.page === '/settings' && <SettingsPage />}
                {store.view.page === '/activities' && (
                  <div>Activities Page</div>
                )}
              </Main>
            </Background>
            <AnimatedBottomNavigation />
          </AppWrapper>
          <TemporaryDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}

export default observer(App)
