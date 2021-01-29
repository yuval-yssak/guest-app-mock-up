import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Badge from '@material-ui/core/Badge'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import EventIcon from '@material-ui/icons/Event'
import styled from 'styled-components'

const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    background-color: ${({ theme }) =>
      theme.palette.type === 'dark'
        ? theme.palette.background.default
        : theme.palette.grey['50']};

    & button {
      transition: all 0.3s;
    }
    & button:hover {
      background-color: ${({ theme }) => theme.palette.primary.main};
      color: ${({ theme }) => theme.palette.primary.contrastText};
    }
  }
`

export default function SimpleBottomNavigation({ openPage }) {
  const [value, setValue] = React.useState(null)

  return (
    <StyledBottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      showLabels
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
