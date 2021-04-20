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
import ChatPage from '../pages/chat/ChatPage'
import LoginPage from '../pages/LoginPage'
import PeoplePage from '../pages/People/People'
import ManualSignUpPage from '../pages/ManualSignUpPage'
import InfoSectionPage from '../pages/InfoPages/InfoSectionPage'
import InfoArrivingAtTheAirport from '../pages/InfoPages/InfoArrivingAtTheAirport'
import { useMst } from '../models/reactHook'
import { SnackbarProvider } from 'notistack'
import WarningsNotifier from './WarningsNotifier'

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
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    background-image: url(/logo.svg);
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
  overflow-y: auto;
  position: relative;

  &:focus {
    outline: none;
  }
`

const AppWrapper = styled.div<{ online: boolean }>`
  width: 100%;
  height: 100vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(
    var(--vh, 1vh) * 100
  ); // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  background-color: ${({ theme, online }) =>
    online ? theme.palette.background.paper : theme.palette.grey['300']};
`

function setGlobalVhProperty() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const mainRef = React.createRef<HTMLElement>()
  const store = useMst()

  React.useEffect(() => {
    setGlobalVhProperty()
    window.addEventListener('resize', setGlobalVhProperty)
    return () => window.removeEventListener('resize', setGlobalVhProperty)
  }, [])

  function getPageTitle() {
    switch (store.view.page) {
      case '/':
        return 'Main Page'
      case '/announcements':
        return 'Announcements'
      case '/chat':
        return 'Chat'
      case '/info-section':
        return 'Info Section'
      case '/info-section/abc/123':
        return 'Info Section ABC 123'
      case '/info-section/arriving-at-the-airport':
        return 'Trip Logistics'
      case '/info-section/practice-guide':
        return 'Practice Guide'
      case '/login':
        return 'Login'
      case '/map':
        return 'Ashram Map'
      case '/my-bookings':
        return 'My Bookings'
      case (store.view.page.match(/^\/people(\/|$)/) || {}).input:
        return 'People & Registrations'
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
      fontFamily:
        'Gotham Rounded SSm A, Gotham Rounded SSm B, Open Sans, Helvetica, Arial, sans-serif',
      allVariants: { fontWeight: 300 },
      h1: { fontSize: '2.2rem' },
      h2: { fontSize: '2rem' },
      h3: { fontSize: '1.4rem' },
      h4: { fontSize: '1.2rem' }
    }
  })

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ['Tab', 'Shift', 'Space', 'Enter'].some(
        k => k === (event as React.KeyboardEvent).key
      )
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
          <SnackbarProvider>
            <WarningsNotifier />
            <AppWrapper online={store.status.online}>
              {store.view.page === '/login' ? (
                <LoginPage />
              ) : store.view.page === '/manualSignup' ? (
                <ManualSignUpPage />
              ) : (
                <>
                  <AppBar
                    toggleDrawer={toggleDrawer}
                    pageTitle={getPageTitle()}
                  />
                  <Background>
                    <Main ref={mainRef} tabIndex={-1}>
                      {store.view.page === '/root' && <h1>Dashboard</h1>}
                      {store.view.page === '/announcements' && (
                        <AnnouncementsPage />
                      )}
                      {store.view.page === '/chat' && <ChatPage />}
                      {store.view.page === '/info-section' && (
                        <InfoSectionPage />
                      )}
                      {store.view.page === '/info-section/abc/123' && (
                        <div>Specific page inside two levels of navigation</div>
                      )}
                      {store.view.page ===
                        '/info-section/arriving-at-the-airport' && (
                        <InfoArrivingAtTheAirport />
                      )}
                      {store.view.page === '/map' && <div>Map</div>}
                      {store.view.page === '/my-bookings' && (
                        <div>Account Details Page</div>
                      )}
                      {store.view.page.match(/\/people(\/|$)/) && (
                        <PeoplePage />
                      )}
                      {store.view.page === '/settings' && <SettingsPage />}
                      {store.view.page === '/activities' && (
                        <div>Activities Page</div>
                      )}
                    </Main>
                  </Background>
                  {/* <AnnouncementSnackbar /> */}
                  <AnimatedBottomNavigation />
                </>
              )}
            </AppWrapper>
            <TemporaryDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
          </SnackbarProvider>{' '}
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}

export default observer(App)
