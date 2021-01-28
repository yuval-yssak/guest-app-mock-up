import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import EventIcon from '@material-ui/icons/Event'
import InfoIcon from '@material-ui/icons/Info'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

const StyledList = styled(List)`
  width: 15.625rem;
`

const StyledAvatar = styled(Avatar)`
  margin: 0.7rem;
`
export default function TemporaryDrawer({ open, toggleDrawer, openPage }) {
  return (
    <div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div role="navigation" onClick={toggleDrawer(false)}>
          <StyledList>
            <StyledAvatar alt="user avatar" src="./images/fake-avatar.jpg" />
          </StyledList>
          <Divider />
          <StyledList>
            <ListItem button onClick={() => openPage('announcements')}>
              <ListItemIcon>
                <AnnouncementIcon />
              </ListItemIcon>
              <Typography>Announcements</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('chat')}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <Typography>Chat</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('activities')}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <Typography>Activities</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('my-bookings')}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <Typography>My Bookings</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('info-section')}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <Typography>Info Section</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('map')}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <Typography>Map</Typography>
            </ListItem>
            <Divider />
            <ListItem button onClick={() => openPage('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <Typography>Settings</Typography>
            </ListItem>
          </StyledList>
        </div>
      </Drawer>
    </div>
  )
}
