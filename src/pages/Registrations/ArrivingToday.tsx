import React from 'react'
import makeData from './makeData'
import { Column } from 'react-table'
import Avatar from '@material-ui/core/Avatar'
import {
  GridCheckbox,
  ScrollableDataGrid
} from '../../components/common/DataGrid/DataGrid'
import styled from 'styled-components'

type ArrivingTodayRow = {
  headshot: string
  arrivalTime: string
  name: string
  rooms: string
  balance: number
  comments: string
  signedForms: boolean
  firstTime: boolean
  nights: number
  preferredContactMethod: string
  appUser: boolean
  credit: boolean
}

const SmallAvatar = styled(Avatar)`
  && {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 15%;
  }
`

const arrivingTodayColumns = [
  {
    Header: 'Avatar',
    accessor: 'headshot',
    Cell: React.memo(({ value, row, column }: any) => {
      return <SmallAvatar src={value} />
    }),
    width: 70,
    disableSortBy: true,
    disableResizing: true
  },
  {
    Header: 'Arrival Time',
    accessor: 'arrivalTime',
    width: 120
  },
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'Rooms',
    accessor: 'rooms',
    width: 140
  },
  {
    Header: 'Balance',
    accessor: 'balance',
    width: 100
  },
  { Header: 'Comments', accessor: 'comments' },
  {
    Header: 'Signed Forms?',
    accessor: 'signedForms',
    Cell: GridCheckbox,
    width: 80
  },
  {
    Header: 'First Time?',
    accessor: 'firstTime',
    Cell: GridCheckbox,
    width: 80
  },
  { Header: 'Nights', accessor: 'nights', width: 80 },
  {
    Header: 'Preferred Contact Method',
    accessor: 'preferredContactMethod'
  },
  { Header: 'App User', accessor: 'appUser', Cell: GridCheckbox },
  { Header: 'Credit?', accessor: 'credit', Cell: GridCheckbox }
] as Column<ArrivingTodayRow>[]

export function ArrivingToday() {
  const columns = React.useMemo(() => arrivingTodayColumns, [])

  const [data, setData] = React.useState(
    () => makeData(80) as ArrivingTodayRow[]
  )

  return (
    <ScrollableDataGrid
      columns={columns}
      data={data}
      setData={setData}
      nonSortable={false}
      disableResize={false}
      withGlobalFilter={true}
    />
  )
}
