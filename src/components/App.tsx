import React from 'react'

import styled, { ThemeProvider, keyframes } from 'styled-components'
import {
  ThemeProvider as MuiThemeProvider,
  createTheme
} from '@material-ui/core'

import { observer } from 'mobx-react-lite'
import CssReset from './CssReset'

import MainBottomNavigation from './SimpleBottomNavigation'
import AppBar from './AppBar'
import ChatPage from '../pages/chat/ChatPage'
import { useMst } from '../models/reactHook'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
    animation: ${scaleFrom0} 1.6s cubic-bezier(0.83, 0, 0.17, 1);
    background-image: url(/logo.svg);
    background-size: 100% 100%;
    filter: ${({ theme }) => theme.palette.mode === 'dark' && `grayscale()`};
    content: '';
    height: 100%;
    opacity: ${({ theme }) => (theme.palette.mode === 'dark' ? 0.08 : 0.1)};
    position: absolute;
    transition: opacity 1s cubic-bezier(0.83, 0, 0.17, 1);
    width: 100%;
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
  background-color: ${({ theme: { palette }, online }) =>
    online ? palette.background.paper : palette.grey['300']};
  color: ${({ theme: { palette } }) =>
    palette.mode === 'dark' ? palette.grey['300'] : 'inherit'};
`

function setGlobalVhProperty() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

function App() {
  const mainRef = React.createRef<HTMLElement>()
  const store = useMst()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  React.useEffect(() => {
    if (prefersDarkMode) store.preferences.toggleDarkMode()
  }, [store.preferences, prefersDarkMode])

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
      case '/announcements/new':
        return 'New Announcement'
      case '/announcements/edit':
        return 'Edit Announcement'
      case '/announcements/stats':
        return `Announcement ${store.view.id} Stats`
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
      case (store.view.page.match(/^\/registrations(\/|$)/) || {}).input:
        const subPage = store.view.page.replace(/^\/registrations/, '').slice(1)

        switch (subPage) {
          case 'arriving-today':
            return 'Arriving Today'
          case 'arriving-soon':
            return 'Arriving in the next 7 days'
          default:
            return 'People List'
        }
      case '/settings':
        return 'Settings'
      case '/activities':
        return 'Activities'
      default:
        return 'No Title...'
    }
  }

  const customTheme = createTheme({
    palette: {
      mode: store.preferences.darkMode ? 'dark' : 'light',
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

  return (
    <>
      <CssReset />
      <MuiThemeProvider theme={customTheme}>
        <ThemeProvider theme={customTheme}>
          <AppWrapper online={store.status.online}>
            <AppBar pageTitle={getPageTitle()} />
            <Background>
              <Main ref={mainRef} tabIndex={-1}>
                <ChatPage />
              </Main>
            </Background>
            <AnimatedBottomNavigation />
          </AppWrapper>
        </ThemeProvider>
      </MuiThemeProvider>
    </>
  )
}

export default observer(App)
