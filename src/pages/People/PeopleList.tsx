// @ts-check
import React from 'react'
import styled from 'styled-components'
// import { XGrid, GridRowParams } from '@material-ui/x-grid'
// import { useMst } from '../../models/reactHook'

const Heading = styled.h2`
  margin-bottom: 2rem;
`

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(max-content, 1fr));
  grid-auto-rows: minmax(max-content, 3rem);
  border: 1px solid #ddd;
  border-radius: 5px;
  // children
  & > div {
    padding: 0.2rem 0.5rem;
  }
`

const TableHeadings = styled.div`
  display: contents;

  & > .column {
    font-weight: 500;
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    border-bottom: 1px solid #ddd;
  }

  & > .column:not(:last-child) {
    border-right: 1px dashed #ddd;
  }
`

const Person = styled.div`
  display: contents;

  &:hover > .column {
    background-color: ${({ theme }) => theme.palette.grey['100']};
  }

  & > .column {
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    cursor: pointer;
  }
  &:not(:last-child) > .column {
    border-bottom: 1px solid #ddd;
  }
`
const Name = styled.div.attrs({ className: 'column name' })`
  flex: 1 1 2rem;
`
const Program = styled.div.attrs({ className: 'column program' })`
  flex: 1 1 2rem;
`
const Room = styled.div.attrs({ className: 'column room' })`
  flex: 1 1 2rem;
`
const Dates = styled.div.attrs({ className: 'column dates' })`
  flex: 1 1 2rem;
`
const Balance = styled.div.attrs({ className: 'column balance' })`
  /* justify-self: end; */
  text-align: right;
`
const FlightArrivalTime = styled.div.attrs({
  className: 'column flightarrivaltime'
})`
  flex: 1 1 2rem;
`
const Notes = styled.div.attrs({ className: 'column notes' })`
  flex: 1 1 2rem;
`

/**
 * {import('@material-ui/x-grid').GridRowsProp[]} rows
 */
const rows = [
  { id: 11, name: 'Hello', program: 'World' },
  { id: 2, name: 'XGrid', program: 'is Awesome' },
  { id: 3, col1: 'Material-UI', col2: 'is Amazing' }
]

rows.forEach(a => a.id)
/**
 * {import('@material-ui/x-grid').GridColDef[]} columns
 */
// const columns = [
//   { field: 'name', headerName: 'Name', width: 150 },
//   { field: 'program', headerName: 'Program', width: 150 }
// ]

// const StyledXGrid = styled(XGrid)`
//   background-color: rgba(255, 255, 255, 0.88);
//   & > .MuiDataGrid-main > div:first-child {
//     display: none;
//   }
// `

function PeopleList({ filter }: { filter?: string }) {
  // const store = useMst()

  // function rowClick(param: GridRowParams, event: React.MouseEvent) {
  //   store.view.openPeoplePage(param.id.toString())
  // }

  return (
    <>
      <Heading>{filter}</Heading>
      <ListContainer>
        <TableHeadings>
          <Name>Name</Name>
          <Program>Program</Program>
          <Room>Room</Room>
          <Dates>Dates</Dates>
          <Balance>Balance</Balance>
          <FlightArrivalTime>Flight Arrival Time</FlightArrivalTime>
          <Notes>Notes</Notes>
        </TableHeadings>
        <Person>
          <Name>John</Name>
          <Program>YVP</Program>
          <Room>23b</Room>
          <Dates>4 - 5, July</Dates>
          <Balance>0</Balance>
          <FlightArrivalTime>13:30</FlightArrivalTime>
          <Notes>Cannot attend</Notes>
        </Person>
        <Person>
          {' '}
          <Name>John</Name>
          <Program>YVP</Program>
          <Room>23b</Room>
          <Dates>4 - 5, July</Dates>
          <Balance>0</Balance>
          <FlightArrivalTime>13:30</FlightArrivalTime>
          <Notes>Cannot attend</Notes>
        </Person>
      </ListContainer>
      <br />
      <br />
      <br />
      <br />
      <div style={{ height: 300, width: '100%' }}>
        {/* <StyledXGrid
          rows={rows}
          columns={columns}
          pagination
          onRowClick={rowClick}
        /> */}
      </div>
    </>
  )
}

// todo: consider resizable columns - see https://codepen.io/lukerazor/pen/GVBMZK

export default PeopleList
