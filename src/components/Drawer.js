import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import ChatIcon from '@material-ui/icons/Chat'
import EventIcon from '@material-ui/icons/Event'
import InfoIcon from '@material-ui/icons/Info'
import MapIcon from '@material-ui/icons/Map'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import SettingsIcon from '@material-ui/icons/Settings'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { useMst } from '../models/reactHook'

const StyledList = styled(List)`
  && {
    width: 15.625rem;
    padding-top: 0;
  }
`

export default function TemporaryDrawer({ open, toggleDrawer }) {
  const { view } = useMst()
  return (
    <div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div role="navigation" onClick={toggleDrawer(false)}>
          <StyledList>
            <ListItem>
              <ListItemAvatar>
                <Avatar alt="user avatar" src="./images/fake-avatar.jpg" />
              </ListItemAvatar>
              <ListItemText primary="Adriel Steuber" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => view.openAnnouncementsPage()}>
              <ListItemIcon>
                <AnnouncementIcon />
              </ListItemIcon>
              <Typography>Announcements</Typography>
            </ListItem>
            <ListItem button onClick={() => view.openChatPage()}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <Typography>Chat</Typography>
            </ListItem>
            <ListItem button onClick={() => view.openActivitiesPage()}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <Typography>Activities</Typography>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <Typography>My Bookings</Typography>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <Typography>Info Section</Typography>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <Typography>Map</Typography>
            </ListItem>
            <Divider />
            <ListItem button onClick={() => view.openSettingsPage()}>
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
