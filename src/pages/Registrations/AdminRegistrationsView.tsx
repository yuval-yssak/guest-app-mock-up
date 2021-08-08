import React from 'react'
import FlightLandIcon from '@material-ui/icons/FlightLand'
import styled from 'styled-components'
import { useMst } from '../../models/reactHook'
import Typography from '@material-ui/core/Typography'
import PageContentWrapper from '../../components/PageContentWrapper'

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
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.09s;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: max-content 1fr;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  & .sub-label {
    font-size: 2rem;
  }
`

function Teaser({
  label,
  subLabel,
  link,
  Icon
}: {
  label: string
  subLabel: string
  link: string
  Icon?: React.ElementType
}) {
  const store = useMst()
  return (
    <StyledTeaser onClick={() => store.view.openRegistrationsPage(link)}>
      <div className="label">{label}</div>
      <div className="sub-label">{subLabel}</div>
      {Icon && (
        <Icon
          fontSize="large"
          style={{ gridColumn: '1/2', gridRow: '1/3', alignSelf: 'center' }}
        />
      )}
    </StyledTeaser>
  )
}

function AdminRegistrationsView() {
  return (
    <PageContentWrapper>
      <Typography variant="h4" style={{ textAlign: 'left' }}>
        ARRIVALS
      </Typography>
      <MainTeasers>
        <Teaser
          label="Today"
          subLabel="12"
          link="arriving-today"
          Icon={FlightLandIcon}
        />
        <Teaser label="Tomorrow" subLabel="5" link="arriving-tomorrow" />
        <Teaser label="Upcoming" subLabel="39" link="arriving-soon" />
        <Teaser label="Departing today" subLabel="2" link="departing-today" />
        <Teaser
          label="Departing tomorrow"
          subLabel="2"
          link="departing-tomorrow"
        />
      </MainTeasers>
      <br />
      <SubTeasers>
        <Teaser label="In House" subLabel="195" link="in-house" />
        <Teaser label="Search" subLabel="Search" link="search" />
        <Teaser label="Arriving Tomorrow" subLabel="5" link="" />
        <Teaser label="Arriving in next 7 days" subLabel="39" link="" />
        <Teaser label="Departing tomorrow" subLabel="2" link="" />
      </SubTeasers>
    </PageContentWrapper>
  )
}

export default AdminRegistrationsView
