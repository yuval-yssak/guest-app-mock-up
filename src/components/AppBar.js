import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MoreIcon from '@material-ui/icons/MoreVert'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import DarkModeSwitch from '../components/DarkModeSwitch'
import { useMst } from '../models/reactHook'
import { LoremIpsum } from 'lorem-ipsum'
import { v4 as uuidv4 } from 'uuid'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

const StyledToolbar = styled(Toolbar).attrs({ className: 'toolbar' })`
  && {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: min-content 1fr minmax(min-content, max-content) max-content;
    justify-items: start;

    @media screen and (max-width: 37.5em), screen and (max-height: 25em) {
      min-height: 2.9rem;

      & > * {
        padding: 0.3rem;
      }
    }

    @media screen and (max-width: 20em), screen and (max-height: 20em) {
      & > * {
        padding: 0 0.3rem;
      }
    }
  }
`

const PageTitle = styled(Typography)`
  && {
    text-align: center;
    font-size: 1.4rem;
    justify-self: start;
    margin-left: 0.5rem;

    @media screen and (max-width: 37.5em), screen and (max-height: 25em) {
      font-size: 1.1rem;
      padding: 0;
      max-width: 6rem;
    }
  }
`

const breakpointShrinkDarkModeSwitch = '(max-width: 21.8em)'

const OneLineDarkModeSwitch = styled(DarkModeSwitch)`
  && {
    display: grid;
    grid-template-columns: max-content minmax(min-content, max-content);
    justify-self: end;
    margin: 0;
    padding: 0;

    @media ${breakpointShrinkDarkModeSwitch} {
      transform: scale(0.75);
      margin-right: -1.1rem;
      /* sc-dOSReg iDtCxH dark-mode-switch-shrinkable-container */

      & .MuiFormControlLabel-label {
        // hide label but keep label for accessibility
        position: absolute;
        top: -40rem;
      }
    }
  }
`

const SwitchContainer = styled.div.attrs({
  className: 'dark-mode-switch-shrinkable-container'
})`
  && {
    padding: 0;
    margin: 0;
    overflow: hidden;
  }
  @media ${breakpointShrinkDarkModeSwitch} {
    height: 3rem;
    display: grid;
    align-content: center;
  }
`

function ShrinkableDarkModeSwitch() {
  return (
    <SwitchContainer>
      <OneLineDarkModeSwitch />
    </SwitchContainer>
  )
}

export default function ProminentAppBar({ toggleDrawer, pageTitle }) {
  const store = useMst()
  const [moreEl, setMoreEl] = React.useState(null)

  const handleMoreClick = event => {
    setMoreEl(event.currentTarget)
  }

  const handleMoreClose = () => {
    setMoreEl(null)
  }

  return (
    <div>
      <AppBar position="static">
        <StyledToolbar>
          <IconButton
            onClick={toggleDrawer(true)}
            edge="start"
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <PageTitle component="h1">{pageTitle}</PageTitle>

          <ShrinkableDarkModeSwitch />
          <IconButton
            aria-label="display more actions"
            edge="end"
            color="inherit"
            aria-haspopup="true"
            onClick={handleMoreClick}
          >
            <MoreIcon />
          </IconButton>
        </StyledToolbar>
      </AppBar>
      <Menu
        id="simple-menu"
        anchorEl={moreEl}
        keepMounted
        open={Boolean(moreEl)}
        onClose={handleMoreClose}
      >
        <MenuItem
          onClick={() => {
            store.announcements.add({
              id: uuidv4(),
              summary: lorem.generateWords(8),
              details: lorem.generateSentences(2),
              timestamp: new Date(),
              status: 'unread',
              priority: 'high'
            })
            handleMoreClose()
          }}
        >
          Create an important Announcement
        </MenuItem>
        <MenuItem
          onClick={() => {
            store.announcements.add({
              id: uuidv4(),
              summary: lorem.generateWords(8),
              details: lorem.generateSentences(2),
              timestamp: new Date(),
              status: 'unread',
              priority: 'low'
            })
            handleMoreClose()
          }}
        >
          Create an Announcement
        </MenuItem>
        <MenuItem
          onClick={() => {
            store.announcements.clearAll()
            handleMoreClose()
          }}
        >
          Clear all announcements
        </MenuItem>
      </Menu>
    </div>
  )
}
