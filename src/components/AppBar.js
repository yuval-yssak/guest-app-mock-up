import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import MoreIcon from '@material-ui/icons/MoreVert'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

const StyledToolbar = styled(Toolbar)`
  && {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: min-content 1fr min-content;
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
    font-size: 1.5rem;
    justify-self: start;
    margin-left: 0.5rem;
  }
`

export default function ProminentAppBar({ toggleDrawer, pageTitle }) {
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

          <IconButton aria-label="search" color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </StyledToolbar>
      </AppBar>
    </div>
  )
}
