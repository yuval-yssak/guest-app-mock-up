import React from 'react'
import makeData from './makeData'
import { Column } from 'react-table'
import Avatar from '@material-ui/core/Avatar'
import {
  GridCheckbox,
  ScrollableDataGrid
} from '../../components/common/DataGrid/DataGrid'

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

const arrivingTodayColumns = [
  {
    Header: '',
    accessor: 'headshot',
    persistant: true,
    Cell: React.memo(({ value, row, column }: any) => {
      return <Avatar src={value} />
    }),
    width: 70,
    disableSortBy: true
  },
  {
    Header: 'Arrival Time',
    accessor: 'arrivalTime',
    persistant: true,
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
    () => makeData(20) as ArrivingTodayRow[]
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
