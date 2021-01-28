import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import InfoIcon from '@material-ui/icons/Info'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import EventIcon from '@material-ui/icons/Event'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'

const StyledList = styled(List)`
  width: 15.625rem;
`

export default function TemporaryDrawer({ open, toggleDrawer, openPage }) {
  return (
    <div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div role="navigation" onClick={toggleDrawer(false)}>
          <StyledList></StyledList>
          <Divider />
          <StyledList>
            <ListItem button onClick={() => openPage('announcements')}>
              <ListItemIcon>
                <AnnouncementIcon />
              </ListItemIcon>
              <ListItemText primary="Announcements" />
            </ListItem>
            <ListItem button onClick={() => openPage('chat')}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <Typography>Chat</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('info-section')}>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <Typography>Info Section</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('account-details')}>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <Typography>Account Details</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <Typography>Settings</Typography>
            </ListItem>
            <ListItem button onClick={() => openPage('activities')}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <Typography>Activities</Typography>
            </ListItem>
          </StyledList>
        </div>
      </Drawer>
    </div>
  )
}
