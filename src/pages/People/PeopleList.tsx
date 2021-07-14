import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import makeData from './makeData'
import { Column } from 'react-table'
import Avatar from '@material-ui/core/Avatar'
import { DataGrid } from '../../components/common/DataGrid/DataGrid'
import TextField from '@material-ui/core/TextField'

type People = {
  headshot: string
  arrivalTime: string
  names: string
  rooms: string
  visits: string
  status: string
}

const EditableCell = React.memo(function EditableCell<
  DataStructure extends {}
>({
  value: initialValue,
  row: { index },
  column: { id },
  setData
}: // updateMyData // This is a custom function that we supplied to our table instance
{
  value: string
  row: { index: number }
  column: { id: string }
  // updateMyData: (...args: any[]) => any | void
  setData: React.Dispatch<React.SetStateAction<DataStructure[]>>

  rest: any[]
}) {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    setData(data => {
      const abd = data.map<DataStructure>(function mapData(currentRow, i) {
        if (i === index) {
          return { ...currentRow, [id]: value }
        } else return currentRow
      })
      return abd
    })
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <TextField
      variant="standard"
      multiline
      maxRows={4}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  )
})

function PeopleList({ filter }: { filter?: string }) {
  const columns = React.useMemo(
    () =>
      [
        {
          Header: 'Headshot',
          accessor: 'headshot',
          persistant: true,
          Cell: React.memo(({ value, row, column }: any) => {
            return <Avatar src={value} />
          })
        },
        {
          Header: 'Arrival Time',
          accessor: 'arrivalTime',
          persistant: true
        },
        {
          Header: 'Names',
          accessor: 'names'
        },
        {
          Header: 'Rooms',
          accessor: 'rooms',
          Cell: EditableCell
        },
        {
          Header: 'Balance',
          accessor: 'visits'
        },
        {
          Header: 'Special Requests',
          accessor: 'status'
        }
      ] as Column<People>[],
    []
  )

  const [data, setData] = React.useState(() => makeData(20) as People[])

  const [sortable, setSortable] = React.useState(false)
  const [disableResize, setDisableResize] = React.useState(true)
  const [disableGlobalFilter, setDisableGlobalFilter] = React.useState(true)

  return (
    <div>
      <CssBaseline />
      <button onClick={() => setSortable(s => !s)}>toggle sortable</button>
      <button onClick={() => setDisableResize(s => !s)}>toggle resize</button>
      <button onClick={() => setDisableGlobalFilter(s => !s)}>
        toggle global filter
      </button>
      <DataGrid
        columns={columns}
        data={data}
        setData={setData}
        nonSortable={!sortable}
        disableResize={disableResize}
        withGlobalFilter={!disableGlobalFilter}
      />
    </div>
  )
}

export default PeopleList
