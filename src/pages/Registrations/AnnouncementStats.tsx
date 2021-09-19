import React from 'react'
import makeData from './makeData'
import { Column } from 'react-table'
import Avatar from '@material-ui/core/Avatar'
import {
  DataGridContainer,
  GridCheckbox,
  ScrollableDataGrid
} from '../../components/common/DataGrid/DataGrid'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { PrimaryButton } from '../../components/common/Buttons'
import { useMst } from '../../models/reactHook'

type ReadConfirmationRow = {
  headshot: string
  status: boolean
  arrivalDate: string
  departureDate: string
  name: string
  currentRoom: string
  balance: number
  comments: string
  firstTime: boolean
  preferredContactMethod: string
  appUser: boolean
}

const SmallAvatar = styled(Avatar)`
  width: 90%;
  height: 90%;
  border-radius: 50%;
`

const readConfirmationListColumns = [
  {
    Header: '',
    accessor: 'headshot',
    Cell: React.memo(({ value }: any) => {
      return <SmallAvatar src={value} />
    }),
    width: 70,
    disableSortBy: true,
    disableResizing: true
  },
  {
    Header: 'Name',
    accessor: 'name'
  },
  { Header: 'Status', accessor: 'status', Cell: GridCheckbox, width: 110 },
  {
    Header: 'Arrival Date',
    accessor: 'arrivalDate',
    width: 120
  },
  {
    Header: 'Departure Date',
    accessor: 'departureDate',
    width: 120
  },
  {
    Header: 'Room',
    accessor: 'currentRoom',
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
  {
    Header: 'Preferred Contact Method',
    accessor: 'preferredContactMethod'
  },
  { Header: 'App User', accessor: 'appUser', Cell: GridCheckbox }
] as Column<ReadConfirmationRow>[]

export function AnnouncementStats() {
  const store = useMst()
  const columns = React.useMemo(() => readConfirmationListColumns, [])

  const [data, setData] = React.useState(() =>
    makeData(20).map<ReadConfirmationRow>(r => ({
      appUser: r.appUser,
      arrivalDate: dayjs()
        .subtract(Math.floor(Math.random() * 15), 'days')
        .format('YYYY-MM-DD'),
      status: Math.random() > 0.5,
      balance: r.balance,
      comments: r.comments,
      firstTime: r.firstTime,
      headshot: r.headshot,
      currentRoom: r.rooms,
      departureDate: dayjs()
        .add(Math.floor(Math.random() * 15), 'days')
        .format('YYYY-MM-DD'),
      name: r.name,
      preferredContactMethod: r.preferredContactMethod
    }))
  )

  return (
    <DataGridContainer>
      <ScrollableDataGrid
        columns={columns}
        data={data}
        setData={setData}
        nonSortable={false}
        disableResize={false}
        withGlobalFilter={true}
        renderButtons={() => (
          <PrimaryButton onClick={() => store.view.openAnnouncementsPage()}>
            Back
          </PrimaryButton>
        )}
      />
    </DataGridContainer>
  )
}
