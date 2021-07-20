import * as React from 'react'
import {
  useTable,
  useBlockLayout,
  useResizeColumns,
  useColumnOrder,
  useSortBy,
  HeaderGroup,
  useRowSelect,
  UseRowSelectRowProps,
  usePagination,
  Column,
  Hooks,
  useGlobalFilter
} from 'react-table'
import { IndeterminateCheckbox } from './IndeterminateCheckBox'
import styled from 'styled-components/macro'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
  Droppable
} from 'react-beautiful-dnd'
import TableToolbar from './TableToolbar'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { HTMLAttributes } from 'react'

const TableBody = styled.div`
  overflow-y: scroll;
  height: 100%;
  flex: 1;
  width: fit-content;
`

const TableHead = styled.div`
  position: relative; // In this example we use an absolutely position resizer, so this is required

  :last-child {
    border-right: 0;
  }
`

const TableHeadRow = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey['200']};
`

const StyledColumn = styled.div<{ isDragging: boolean }>`
  ${({ isDragging }) => isDragging && 'background-color: #eee;'}
`

function ColumnComponent<DataStructure extends {}>({
  snapshot,
  provided,
  column,
  setIsResizing,
  nonSortable,
  disableResize
}: {
  provided: DraggableProvided
  snapshot: DraggableStateSnapshot
  column: HeaderGroup<DataStructure>
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>
  nonSortable: boolean
  disableResize: boolean
}) {
  const [onHover, setOnHover] = React.useState(false)

  return (
    <StyledColumn
      isDragging={snapshot.isDragging}
      className="th"
      {...column.getHeaderProps(
        !nonSortable ? column.getSortByToggleProps() : undefined
      )}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <Tooltip title={column.render('Header') || ''}>
        <Heading
          isDragging={snapshot.isDragging}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          {column.render('Header')}
          {/* Use column.getResizerProps to hook up the events correctly */}
          {!disableResize && (
            <Resizer
              {...column.getResizerProps()}
              onMouseEnter={() => setIsResizing(true)}
              onMouseLeave={() => setIsResizing(false)}
            />
          )}
          {!nonSortable && (
            <SortIcon
              isSorted={column.isSorted}
              isSortedDesc={column.isSortedDesc}
              onHover={onHover}
            ></SortIcon>
          )}
        </Heading>
      </Tooltip>
    </StyledColumn>
  )
}

const Heading = styled.div<{ isDragging: boolean }>`
  ${({ isDragging }) => !isDragging && 'transform: inherit !important;'}
  background-color: ${({ isDragging }) =>
    isDragging ? 'lightYellow' : 'white'};
  border-radius: 0.4rem;
  padding: 0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TableCell = ({
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement & { value: any }>) => {
  return (
    <div {...rest}>
      <Tooltip title={React.Children.only(children) || ''}>
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {children}
        </div>
      </Tooltip>
    </div>
  )
}

const DroppableContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.grey['200']};
  border-radius: 0;
  border-spacing: 0;
  display: flex;
  flex-direction: column;
  overflow: scroll;

  .tr {
    :last-child {
      .td {
        border-bottom: 0;
      }
    }
  }

  .td {
    padding: 0.5rem;
    margin: 0;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey['200']};
    /* border-right: 1px solid black; */
    display: flex;
    align-items: center;
    :last-child {
      border-right: 0;
    }
    :nth-child(1),
    :nth-child(2) {
      border-right: 0;
    }
  }
`

const SortIcon = ({
  isSorted,
  isSortedDesc,
  onHover
}: {
  isSorted: boolean
  isSortedDesc: boolean | undefined
  onHover: boolean
}) => {
  return (
    <span>
      {(onHover || isSorted) && (
        <SortIconComponent
          className="MuiSvgIcon-root MuiDataGrid-sortIcon MuiSvgIcon-fontSizeSmall"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          hint={!isSorted && onHover}
          up={!!isSortedDesc}
        >
          <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
        </SortIconComponent>
      )}
    </span>
  )
}

const SortIconComponent = styled.svg<{ hint: boolean; up: boolean }>`
  color: ${({ hint }) => (hint ? '#ddd' : 'black')};
  fill: currentColor;
  height: 1em;
  transform: rotate(${({ up }) => (up ? 0 : 180)}deg);
  width: 1em;
`

const ResizerComponent = styled.svg`
  color: #ddd;
  display: inline-block;
  font-size: 1.5rem;
  flex-shrink: 0;
  height: 1em;
  fill: currentColor;
  position: absolute;
  right: 0;
  top: 50%;
  touch-action: none; // prevents from scrolling while dragging on touch devices
  transform: translate(50%, -50%);
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  width: 1em;
  z-index: 1;
`

const Resizer = (props: React.SVGAttributes<SVGElement>) => (
  <ResizerComponent {...props}>
    <path d="M11 19V5h2v14z"></path>
  </ResizerComponent>
)

function pushSelectColumn<DataStructure extends {}>(
  hooks: Hooks<DataStructure>
) {
  hooks.visibleColumns.push(columns => {
    return [
      {
        id: 'selection',
        Header: React.memo(({ getToggleAllRowsSelectedProps }) => (
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        )),
        Cell: React.memo(
          ({ row }: { row: UseRowSelectRowProps<DataStructure> }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          )
        ),
        width: 20
      },
      ...columns
    ]
  })
}

export function ScrollableDataGrid<DataStructure extends {}>({
  columns,
  data,
  setData,
  nonSortable = false,
  disableResize = false,
  withGlobalFilter = false
}: {
  columns: Column<DataStructure>[]
  data: DataStructure[]
  setData: React.Dispatch<React.SetStateAction<DataStructure[]>>
  nonSortable?: boolean
  disableResize?: boolean
  withGlobalFilter?: boolean
}) {
  return (
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
        nonSortable={nonSortable}
        disableResize={disableResize}
        withGlobalFilter={withGlobalFilter}
      />
    </div>
  )
}

export function DataGrid<DataStructure extends {}>({
  columns,
  data,
  setData,
  nonSortable = false,
  disableResize = false,
  withGlobalFilter = false
}: {
  columns: Column<DataStructure>[]
  data: DataStructure[]
  setData: React.Dispatch<React.SetStateAction<DataStructure[]>>
  nonSortable?: boolean
  disableResize?: boolean
  withGlobalFilter?: boolean
}) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setColumnOrder,
    visibleColumns,
    state,
    page,
    gotoPage,
    pageCount,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize, globalFilter },
    setPageSize,
    setGlobalFilter
  } = useTable<DataStructure>(
    {
      columns,
      data,
      defaultColumn,
      disableSortBy: nonSortable,
      disableResizing: disableResize,
      disableGlobalFilter: !withGlobalFilter,
      setData,
      // set global filter to search only in certain columns
      globalFilter: (rows, _columnIds, filterValue: string) => {
        return rows.filter(row =>
          filterValue
            .trim()
            .split(/\W/)
            .every(word => {
              let wordMatch = false
              for (const column in row.values) {
                if (
                  ['name', 'comments'].some(
                    filterableColumn => column === filterableColumn
                  )
                ) {
                  if (!wordMatch)
                    wordMatch = !!(row.values[column] as string).match(
                      new RegExp(word, 'i')
                    )
                }
              }
              return wordMatch
            })
        )
      }
    },
    useBlockLayout,
    useResizeColumns,
    useColumnOrder,
    useGlobalFilter,
    useSortBy,
    pushSelectColumn,
    usePagination,
    useRowSelect
  )

  const currentColumnOrder = React.useRef<string[]>([])
  const [isResizing, setIsResizing] = React.useState(false)

  const onDragUpdate = ({ destination, source, draggableId }: DragUpdate) => {
    const newColumnOrder = currentColumnOrder.current.slice()
    const sIndex = source.index
    const dIndex = destination && destination.index

    if (typeof sIndex === 'number' && typeof dIndex === 'number') {
      newColumnOrder.splice(sIndex, 1)
      newColumnOrder.splice(dIndex, 0, draggableId)
      setColumnOrder(newColumnOrder)
    }
  }

  const onDragStart = () =>
    (currentColumnOrder.current = state.columnOrder.length
      ? state.columnOrder
      : visibleColumns.map(c => c.id))

  return (
    <>
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragUpdate}
      >
        <Droppable droppableId="all-columns" direction="horizontal">
          {provided => (
            <DroppableContainer
              {...getTableProps()}
              className="table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <TableHead>
                {headerGroups.map(headerGroup => (
                  <TableHeadRow
                    {...headerGroup.getHeaderGroupProps()}
                    className="tr"
                  >
                    {headerGroup.headers.map((column, i) => (
                      <Draggable
                        isDragDisabled={isResizing}
                        key={column.id}
                        draggableId={column.id}
                        index={i}
                      >
                        {(provided, snapshot) => (
                          <ColumnComponent
                            snapshot={snapshot}
                            provided={provided}
                            column={column}
                            setIsResizing={setIsResizing}
                            nonSortable={nonSortable || !!column.disableSortBy}
                            disableResize={
                              disableResize || !!column.disableResizing
                            }
                          ></ColumnComponent>
                        )}
                      </Draggable>
                    ))}
                  </TableHeadRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row)
                  return (
                    <div {...row.getRowProps()} className="tr">
                      {row.cells.map(cell => {
                        return (
                          <TableCell
                            {...cell.getCellProps()}
                            style={{
                              ...cell.getCellProps().style,
                              display: ''
                            }}
                            className="td"
                          >
                            {cell.render('Cell')}
                          </TableCell>
                        )
                      })}
                    </div>
                  )
                })}
              </TableBody>
              {provided.placeholder}
            </DroppableContainer>
          )}
        </Droppable>
      </DragDropContext>
      <div style={{ marginTop: '1rem' }}>
        <span>
          Page <strong>{pageIndex + 1}</strong> of{' '}
          <strong>{pageOptions.length}</strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            value={pageIndex + 1}
            onChange={e => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(pageNumber)
            }}
          />
        </span>
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 25, 50, Number.MAX_SAFE_INTEGER].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize === Number.MAX_SAFE_INTEGER ? 'All' : pageSize}
            </option>
          ))}
        </select>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
      </div>
      {withGlobalFilter && (
        <TableToolbar
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      )}
    </>
  )
}

export const EditableCell = React.memo(function EditableCell<
  DataStructure extends {}
>({
  value: initialValue,
  row: { index },
  column: { id },
  setData
}: {
  value: string
  row: { index: number }
  column: { id: string }
  setData: React.Dispatch<React.SetStateAction<DataStructure[]>>
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

export function GridCheckbox({ value }: { value: boolean }) {
  return <Checkbox checked={value} />
}
