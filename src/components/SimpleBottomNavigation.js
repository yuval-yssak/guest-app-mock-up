import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Badge from '@material-ui/core/Badge'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import EventIcon from '@material-ui/icons/Event'
import styled from 'styled-components'

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
        min-width: 60px;
        padding: 0;
      }
    }
    & button:hover {
      background-color: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.primary.contrastText};
    }
  }
`

export default function SimpleBottomNavigation({ openPage, className }) {
  const smallDeviceHeight = useMediaQuery(breakpointSmallHeight)
  const [value, setValue] = React.useState(null)

  return (
    <StyledBottomNavigation
      className={className}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      showLabels={!smallDeviceHeight}
    >
      <BottomNavigationAction
        label="Announcements"
        icon={
          <Badge badgeContent={4} color="secondary">
            <AnnouncementIcon />
          </Badge>
        }
        onClick={() => openPage('announcements')}
      />
      <BottomNavigationAction
        label="Chat"
        icon={
          <Badge badgeContent={3} color="secondary">
            <ChatIcon />
          </Badge>
        }
        onClick={() => openPage('chat')}
      />
      <BottomNavigationAction
        label="Activities"
        icon={<EventIcon />}
        onClick={() => openPage('activities')}
      />
    </StyledBottomNavigation>
  )
}
