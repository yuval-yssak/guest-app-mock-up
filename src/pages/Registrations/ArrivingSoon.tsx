import React from 'react'
import makeData from './makeData'
import { Column } from 'react-table'
import Avatar from '@material-ui/core/Avatar'
import {
  GridCheckbox,
  ScrollableDataGrid
} from '../../components/common/DataGrid/DataGrid'
import styled from 'styled-components'

type ArrivingSoonRow = {
  headshot: string
  arrivalDate: string
  name: string
  rooms: string
  balance: number
  comments: string
  firstTime: boolean
  nights: number
  preferredContactMethod: string
  appUser: boolean
  credit: boolean
}

const SmallAvatar = styled(Avatar)`
  width: 80%;
  height: 80%;
  border-radius: 50%;
`

const arrivingSoonColumns = [
  {
    Header: '',
    accessor: 'headshot',
    Cell: React.memo(({ value, row, column }: any) => {
      return <SmallAvatar src={value} />
    }),
    width: 70,
    disableSortBy: true,
    disableResizing: true
  },
  {
    Header: 'Arrival Date',
    accessor: 'arrivalDate',
    width: 120,
    Cell: ({ value }: { value: string }) => value.slice(0, 10)
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
] as Column<ArrivingSoonRow>[]

export function ArrivingSoon() {
  const columns = React.useMemo(() => arrivingSoonColumns, [])

  const [data, setData] = React.useState(
    () =>
      makeData(20).map<ArrivingSoonRow>(r => ({
        appUser: r.appUser,
        arrivalDate: new Date().toISOString(),
        balance: r.balance,
        comments: r.comments,
        credit: r.credit,
        firstTime: r.firstTime,
        headshot: r.headshot,
        name: r.name,
        nights: r.nights,
        preferredContactMethod: r.preferredContactMethod,
        rooms: r.rooms
      })) as ArrivingSoonRow[]
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
