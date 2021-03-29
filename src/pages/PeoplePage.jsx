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
    padding-top: 2rem;
  }
`

const MainTeasers = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;
  justify-items: center;
`

const SubTeasers = MainTeasers

const StyledTeaser = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.palette.grey['200']};
  padding: 1rem;
  border-radius: 10px;

  & .sub-label {
    font-size: 5rem;
  }
`

function Teaser({ label, subLabel }) {
  return (
    <StyledTeaser>
      <div className="label">{label}</div>
      <div className="sub-label">{subLabel}</div>
    </StyledTeaser>
  )
}
function PeoplePage() {
  // const { ? } = useMst()

  return (
    <ScrollablePageContentWrapper role="article">
      <MainTeasers>
        <Teaser label="Arriving Today" subLabel="12" />
        <Teaser label="Arriving Tomorrow" subLabel="5" />
        <Teaser label="Arriving in next 7 days" subLabel="39" />
        <Teaser label="Departing tomorrow" subLabel="2" />
      </MainTeasers>
      <br />
      <SubTeasers>
        <Teaser subLabel="Search" />
        <Teaser label="Arriving Tomorrow" subLabel="5" />
        <Teaser label="Arriving in next 7 days" subLabel="39" />
        <Teaser label="Departing tomorrow" subLabel="2" />
      </SubTeasers>
    </ScrollablePageContentWrapper>
  )
}

export default observer(PeoplePage)
