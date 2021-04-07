import React from 'react'
import { observer } from 'mobx-react-lite'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Badge from '@material-ui/core/Badge'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import EventIcon from '@material-ui/icons/Event'
import styled from 'styled-components'
import { useMst } from '../models/reactHook'

const breakpointSmallHeight = 'screen and (max-height: 20em)'

const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    background-color: ${({ theme }) =>
      theme.palette.type === 'dark'
        ? theme.palette.background.default
        : theme.palette.grey['50']};
    height: unset;

    & .MuiBottomNavigationAction-label.MuiBottomNavigationAction-iconOnly {
      display: none;
    }

    & button {
      transition: all 0.3s;

      @media (max-width: 19.25em) {
        min-width: 45px;
        padding: 0;
      }
    }
    & button:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`

function getNavigationIndexBasedOnPage(page: string) {
  switch (page) {
    case '/announcements':
      return 0
    case '/chat':
      return 1
    case '/activities':
      return 2
    default:
      return undefined
  }
}

function MainBottomNavigation({ className }: { className?: string }) {
  const store = useMst()
  const smallDeviceHeight = useMediaQuery(breakpointSmallHeight)

  // highlight the current page on the bottom navigaion
  const value = getNavigationIndexBasedOnPage(store.view.page)

  return (
    <StyledBottomNavigation
      className={className}
      value={value}
      showLabels={!smallDeviceHeight}
    >
      <BottomNavigationAction
        label="Announcements"
        icon={
          <Badge
            badgeContent={store.announcements.unread.length}
            color="secondary"
          >
            <AnnouncementIcon />
          </Badge>
        }
        onClick={() => store.view.openAnnouncementsPage()}
      />
      <BottomNavigationAction
        label="Chat"
        icon={
          <Badge
            badgeContent={store.chats.withSelf.unreadCount}
            color="secondary"
          >
            <ChatIcon />
          </Badge>
        }
        onClick={() => store.view.openChatPage()}
      />
      <BottomNavigationAction
        label="Activities"
        icon={<EventIcon />}
        onClick={() => store.view.openActivitiesPage()}
      />
    </StyledBottomNavigation>
  )
}

export default observer(MainBottomNavigation)
