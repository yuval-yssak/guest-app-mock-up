import React from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import PageContentWrapper from '../components/PageContentWrapper'

// import { useMst } from '../models/reactHook'

const ScrollablePageContentWrapper = styled(PageContentWrapper).attrs({
  className: 'scrollable'
})`
  && {
    overflow-y: scroll;
    grid-template-rows: min-content 1fr;
    align-items: start;
  }
`

function PeoplePage() {
  // const { ? } = useMst()

  return (
    <ScrollablePageContentWrapper role="article">
      Search People
    </ScrollablePageContentWrapper>
  )
}

export default observer(PeoplePage)
