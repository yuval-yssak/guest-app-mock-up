import React from 'react'
import PageMainPaper from '../components/PageMainPaper'
import DarkModeSwitch from '../components/DarkModeSwitch'
import styled from 'styled-components'

const StyledPageMainPaper = styled(PageMainPaper).attrs({
  clasName: 'setting-page-container'
})`
  justify-content: center;
`

export default function SettingsPage() {
  return (
    <StyledPageMainPaper role="article" elavation={2}>
      <DarkModeSwitch />
    </StyledPageMainPaper>
  )
}
