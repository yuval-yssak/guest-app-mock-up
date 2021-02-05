import React from 'react'
import PageContentWrapper from '../components/PageContentWrapper'
import DarkModeSwitch from '../components/DarkModeSwitch'
import styled from 'styled-components'

const StyledPageContentWrapper = styled(PageContentWrapper).attrs({
  clasName: 'setting-page-container'
})`
  justify-content: center;
`

export default function SettingsPage() {
  return (
    <StyledPageContentWrapper role="article">
      <DarkModeSwitch />
    </StyledPageContentWrapper>
  )
}
