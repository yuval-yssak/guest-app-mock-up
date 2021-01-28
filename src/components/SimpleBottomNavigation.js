import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import EventIcon from '@material-ui/icons/Event'
import styled from 'styled-components'

const StyledBottomNavigation = styled(BottomNavigation)`
  && {
    background-color: ${({ theme }) => theme.palette.grey['50']};

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
  const [value, setValue] = React.useState(0)

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
        icon={<AnnouncementIcon />}
        onClick={() => openPage('announcements')}
      />
      <BottomNavigationAction
        label="Chat"
        icon={<ChatIcon />}
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
