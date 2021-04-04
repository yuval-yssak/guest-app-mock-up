import React, { MouseEventHandler } from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Badge from '@material-ui/core/Badge'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import PeopleIcon from '@material-ui/icons/People'
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

const StyledList = styled(List).attrs({ className: 'drawer-list' })`
  && {
    width: 15.625rem;
    padding-top: 0;

    @media (max-width: 20em) {
      & > .MuiListItem-root {
        padding-top: 0.5rem;
      }
    }

    & > .MuiDivider-root + .MuiListItem-root {
      margin-top: 0.5rem;
    }
  }
`

const StyledListItemIcon = styled(ListItemIcon).attrs({
  className: 'list-item-icon'
})`
  && {
    min-width: 2.8rem;
  }
`

export default function TemporaryDrawer({
  open,
  toggleDrawer
}: {
  open: boolean
  toggleDrawer: (open: boolean) => MouseEventHandler<HTMLElement>
}) {
  const store = useMst()
  return (
    <div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div role="navigation" onClick={toggleDrawer(false)}>
          <StyledList>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt={store.loggedInUser?.personName}
                  src={store.loggedInUser?.imageSrc}
                />
              </ListItemAvatar>
              <ListItemText primary={store.loggedInUser?.personName} />
            </ListItem>
            <Divider />
            {store.loggedInUser?.type === 'staff' && (
              <ListItem button onClick={() => store.view.openPeoplePage()}>
                <StyledListItemIcon>
                  <PeopleIcon />
                </StyledListItemIcon>
                <Typography>People</Typography>
              </ListItem>
            )}
            <ListItem button onClick={() => store.view.openAnnouncementsPage()}>
              <StyledListItemIcon>
                <Badge
                  badgeContent={store.announcements.unread.length}
                  color="secondary"
                >
                  <AnnouncementIcon />
                </Badge>
              </StyledListItemIcon>
              <Typography>Announcements</Typography>
            </ListItem>
            <ListItem button onClick={() => store.view.openChatPage()}>
              <StyledListItemIcon>
                <Badge badgeContent={store.chat.unreadCount} color="secondary">
                  <ChatIcon />
                </Badge>
              </StyledListItemIcon>
              <Typography>Chat</Typography>
            </ListItem>
            <ListItem button onClick={() => store.view.openActivitiesPage()}>
              <StyledListItemIcon>
                <EventIcon />
              </StyledListItemIcon>
              <Typography>Activities</Typography>
            </ListItem>
            <ListItem button>
              <StyledListItemIcon>
                <AccountBoxIcon />
              </StyledListItemIcon>
              <Typography>My Bookings</Typography>
            </ListItem>
            <ListItem button onClick={() => store.view.openInfoSectionPage()}>
              <StyledListItemIcon>
                <InfoIcon />
              </StyledListItemIcon>
              <Typography>Info Section</Typography>
            </ListItem>
            <ListItem button>
              <StyledListItemIcon>
                <MapIcon />
              </StyledListItemIcon>
              <Typography>Map</Typography>
            </ListItem>
            <Divider />
            <ListItem button onClick={() => store.view.openSettingsPage()}>
              <StyledListItemIcon>
                <SettingsIcon />
              </StyledListItemIcon>
              <Typography>Settings</Typography>
            </ListItem>
          </StyledList>
        </div>
      </Drawer>
    </div>
  )
}
