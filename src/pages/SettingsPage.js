import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionActions from '@material-ui/core/AccordionActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'

import Switch from '../components/Switch'

import styled from 'styled-components'
import PageMainPaper from '../components/PageMainPaper'
import PageTitle from '../components/PageTitle'

export default function SettingsPage({ darkTheme, setDarkTheme }) {
  return (
    <PageMainPaper role="article" elavation={2}>
      <PageTitle component="h1">Settings</PageTitle>
      <Switch
        darkTheme={darkTheme}
        onThemeChange={() => setDarkTheme(!darkTheme)}
      />
    </PageMainPaper>
  )
}
