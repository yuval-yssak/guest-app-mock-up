import React from 'react'
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk'
import FlightLandIcon from '@material-ui/icons/FlightLand'
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff'
import GroupIcon from '@material-ui/icons/Group'
import Typography from '@material-ui/core/Typography'
import SchoolIcon from '@material-ui/icons/School'
import SearchIcon from '@material-ui/icons/Search'
import styled from 'styled-components'
import { useMst } from '../../models/reactHook'
import PageContentWrapper from '../../components/PageContentWrapper'

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

const CustomPageContentWrapper = styled(PageContentWrapper).attrs({
  className: 'registrations-teasers-container'
})`
  grid-template-rows: unset;
  grid-auto-rows: max-content;

  @media (max-width: 36.5em) {
    grid-template-columns: 95%;
  }
`

const MainTeasers = styled.div.attrs({
  className: 'main-teasers'
})`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1rem;

  & > div {
    flex: 1;
    min-width: 15rem;
  }
`
const SubTeasers = styled(MainTeasers)`
  & > div {
    background-color: #97f7d7;
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

const Heading = styled(Typography).attrs({ variant: 'h4' })`
  text-align: left;
  text-transform: uppercase;

  && {
    margin-bottom: 0.5rem;
    margin-top: 2rem;
  }
`

function AdminRegistrationsView() {
  return (
    <CustomPageContentWrapper>
      <Heading>Departures</Heading>
      <MainTeasers>
        <Teaser
          label="Today"
          subLabel="12"
          link="arriving-today"
          Icon={FlightTakeoffIcon}
        />
        <Teaser
          label="Tomorrow"
          subLabel="5"
          link="arriving-tomorrow"
          Icon={FlightTakeoffIcon}
        />
        <Teaser
          label="Upcoming"
          subLabel="39"
          link="arriving-soon"
          Icon={FlightTakeoffIcon}
        />
      </MainTeasers>
      <Heading>Arrivals</Heading>
      <MainTeasers>
        <Teaser
          label="Yesterday"
          subLabel="8"
          link="arriving-yesterday"
          Icon={FlightLandIcon}
        />
        <Teaser
          label="Today"
          subLabel="2"
          link="arriving-today"
          Icon={FlightLandIcon}
        />
        <Teaser
          label="Upcoming"
          subLabel="2"
          link="arriving-upcoming"
          Icon={FlightLandIcon}
        />
      </MainTeasers>
      <Heading>In House</Heading>
      <MainTeasers>
        <Teaser
          label="In House"
          subLabel="195"
          link="in-house"
          Icon={GroupIcon}
        />
        <Teaser
          label="TTC/ATTC"
          subLabel="39"
          link="current-ttc-attc-students"
          Icon={SchoolIcon}
        />
        <Teaser
          label="Karma Yogis"
          subLabel="99"
          link="current-ky"
          Icon={DirectionsWalkIcon}
        />
      </MainTeasers>
      <Heading>Other</Heading>
      <SubTeasers>
        <Teaser
          label="Global Search"
          subLabel="63452"
          link="search"
          Icon={SearchIcon}
        />
        <Teaser label="Arriving Tomorrow" subLabel="5" link="" />
        <Teaser label="Arriving in next 7 days" subLabel="39" link="" />
      </SubTeasers>
    </CustomPageContentWrapper>
  )
}

export default AdminRegistrationsView
