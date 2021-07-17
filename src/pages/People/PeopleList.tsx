import React from 'react'

import makeData from './makeData'
import { Column } from 'react-table'
import Avatar from '@material-ui/core/Avatar'
import { DataGrid } from '../../components/common/DataGrid/DataGrid'
import Checkbox from '@material-ui/core/Checkbox'

type People = {
  headshot: string
  arrivalTime: string
  name: string
  rooms: string
  status: string
  balance: number
  comments: string
  signedForms: boolean
  firstTime: boolean
  nights: number
  preferredContactMethod: string
  appUser: boolean
  credit: boolean
}

function MyCheckbox({ value }: { value: boolean }) {
  return <Checkbox checked={value} />
}

function PeopleList({ filter }: { filter?: string }) {
  const columns = React.useMemo(
    () =>
      [
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
          Cell: MyCheckbox,
          width: 80
        },
        {
          Header: 'First Time?',
          accessor: 'firstTime',
          Cell: MyCheckbox,
          width: 80
        },
        { Header: 'Nights', accessor: 'nights', width: 80 },
        {
          Header: 'Preferred Contact Method',
          accessor: 'preferredContactMethod'
        },
        { Header: 'App User', accessor: 'appUser', Cell: MyCheckbox },
        { Header: 'Credit?', accessor: 'credit', Cell: MyCheckbox }
      ] as Column<People>[],
    []
  )

  const [data, setData] = React.useState(() => makeData(20) as People[])

  return (
    <div
      style={{
        padding: '100px',
        overflow: 'hidden',
        width: '100%',
        height: '100%'
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <DataGrid
          columns={columns}
          data={data}
          setData={setData}
          nonSortable={false}
          disableResize={false}
          withGlobalFilter={true}
        />
      </div>
    </div>
  )
}

export default PeopleList
