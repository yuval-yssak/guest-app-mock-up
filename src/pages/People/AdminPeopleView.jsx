import React from 'react'
import styled from 'styled-components'
import { useMst } from '../../models/reactHook'

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
  cursor: pointer;
  transition: all 0.09s;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  & .sub-label {
    font-size: 5rem;
  }
`

function Teaser({ label, subLabel, link }) {
  const store = useMst()
  return (
    <StyledTeaser onClick={() => store.view.openPeoplePage(link)}>
      <div className="label">{label}</div>
      <div className="sub-label">{subLabel}</div>
    </StyledTeaser>
  )
}

function AdminPeopleView() {
  return (
    <>
      <MainTeasers>
        <Teaser label="In House" subLabel="195" link="in-house" />
        <Teaser label="Arriving Today" subLabel="12" link="arriving-today" />
        <Teaser
          label="Arriving Tomorrow"
          subLabel="5"
          link="arriving-tomorrow"
        />
        <Teaser
          label="Arriving in next 7 days"
          subLabel="39"
          link="arriving-soon"
        />
        <Teaser label="Departing today" subLabel="2" link="departing-today" />
        <Teaser
          label="Departing tomorrow"
          subLabel="2"
          link="departing-tomorrow"
        />
      </MainTeasers>
      <br />
      <SubTeasers>
        <Teaser subLabel="Search" link="search" />
        <Teaser label="Arriving Tomorrow" subLabel="5" />
        <Teaser label="Arriving in next 7 days" subLabel="39" />
        <Teaser label="Departing tomorrow" subLabel="2" />
      </SubTeasers>
    </>
  )
}

export default AdminPeopleView
