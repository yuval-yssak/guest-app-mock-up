import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import Switch from './Switch'
import styled from 'styled-components'

const StyledList = styled(List)`
  width: 15.625rem;
`

export default function TemporaryDrawer({
  open,
  toggleDrawer,
  darkTheme,
  setDarkTheme
}) {
  const list = () => (
    <div role="presentation" onClick={toggleDrawer(false)}>
      <StyledList>
        <ListItem>
          <Switch
            darkTheme={darkTheme}
            onThemeChange={() => setDarkTheme(!darkTheme)}
          />
        </ListItem>
      </StyledList>
      <Divider />
      <StyledList>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </StyledList>
      <Divider />
      <StyledList>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </StyledList>
    </div>
  )

  return (
    <div>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      )
    </div>
  )
}
