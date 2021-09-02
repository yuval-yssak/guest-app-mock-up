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
  useGlobalFilter,
  Row,
  IdType,
  useAsyncDebounce,
  TableSortByToggleProps
} from 'react-table'
import styled from 'styled-components/macro'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragUpdate,
  Droppable
} from 'react-beautiful-dnd'
import GlobalFilter from './GlobalFilter'
import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIosNewIcon from '@material-ui/icons/ArrowBackIosNew'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { PrimaryButton } from '../Buttons'

const TableControlSection = styled.div`
  align-items: center;
  column-gap: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
  min-height: 4rem;
  padding: 0 2rem;
  row-gap: 0.5rem;
  width: 100%;

  @media (max-width: 23em) {
    padding: 0;
  }
`

const PaginationWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 26rem;
  flex-shrink: 1;
  gap: min(2rem, calc(100vw / 30));
  justify-content: space-around;

  /* rows per page selection */
  & > div:nth-child(1) {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    @media (max-width: 22em) {
      & > span {
        display: none;
      }
    }
  }

  /* rows indicator */
  & > div:nth-child(2) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1ch;
    flex: 1 3rem 0;
    text-align: center;
  }
`

const ActionsContainer = styled.div`
  display: flex;
  flex-basis: 20rem;
  gap: 1rem;
  align-items: center;
  flex-wrap: nowrap;
  flex-grow: 1;
  flex-shrink: 1;
  justify-content: center;
`

const CenteredSelect = styled(Select)`
  & > [role='button'] {
    padding-top: 0;
    padding-bottom: 0;
  }
`

const TableBody = styled.div`
  flex: 1;
  width: 100%;
`

const TableRow = styled.div<{ odd?: boolean }>`
  margin: 0 auto;
  ${({ odd }) => odd && `background-color: rgba(240, 240, 240, 0.05);`}
`

const TableHead = styled.div`
  /* In this example we use an absolutely position resizer, 
  so a relative position is required, and sticky is also relative. */
  min-height: 4rem;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 2;

  :last-child {
    border-right: 0;
  }
`

const TableHeadRow = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.grey['200']};
  border-radius: 0;
  border-spacing: 0;
  margin: 0 auto;
  background-color: ${({ theme: { palette } }) =>
    palette.grey[palette.mode === 'dark' ? '900' : '50']};
`

const StyledColumn = styled.div<{ isDragging: boolean }>`
  align-items: center;
  display: flex;
  font-weight: 400;
  padding: 1rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
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

  const { title, ...sortProperties } =
    column.getSortByToggleProps() as TableSortByToggleProps & { title: string }

  const { style, ...columnHeaderProps } = column.getHeaderProps(
    !nonSortable ? sortProperties : undefined
  )

  return (
    <Heading
      className="td"
      isDragging={snapshot.isDragging}
      {...provided.dragHandleProps}
      {...provided.draggableProps}
      ref={provided.innerRef}
      width={style?.width}
    >
      <StyledColumn
        isDragging={snapshot.isDragging}
        className="th"
        {...columnHeaderProps}
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        <TooltipOnOverflow
          tooltip={
            column.id === 'selection' ? '' : column.render('Header') || ''
          }
        >
          <HeadingCell>{column.render('Header')}</HeadingCell>
        </TooltipOnOverflow>
        {!nonSortable && (
          <SortIcon
            isSorted={column.isSorted}
            isSortedDesc={column.isSortedDesc}
            onHover={onHover}
          ></SortIcon>
        )}
        {!disableResize && (
          <Resizer
            {...column.getResizerProps()}
            onMouseEnter={() => setIsResizing(true)}
            onMouseLeave={() => setIsResizing(false)}
          />
        )}
      </StyledColumn>
    </Heading>
  )
}

const Heading = styled.div<{
  isDragging: boolean
  width: React.CSSProperties['width']
}>`
  ${({ isDragging }) => !isDragging && 'transform: inherit !important;'}
  width: ${({ width }) => width};
`

const OverflowCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const HeadingCell = styled(OverflowCell)`
  flex-shrink: 1;
`

const DataGridCell = styled(OverflowCell)``

const DroppableTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  font-size: 0.85rem;

  .td {
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey['200']};
    display: flex;
    margin: 0;
    padding: 0.1rem 0.3rem;
  }
`

const SortIconHoverComponent = styled.div`
  align-items: center;
  border-radius: 50%;
  display: flex;
  flex-basis: 1.8em;
  flex-shrink: 0;
  justify-content: center;
  padding: 0.2rem;

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey['200']};
  }
`

const PageInputTextField = styled(TextField)`
  width: 2.5rem;

  & input {
    padding: 0.3rem 0;
    text-align: center;
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
    <SortIconHoverComponent>
      <SortIconComponent
        show={onHover || isSorted}
        className="MuiSvgIcon-root MuiDataGrid-sortIcon MuiSvgIcon-fontSizeSmall"
        focusable="false"
        viewBox="0 0 24 24"
        aria-hidden="true"
        hint={!isSorted && onHover}
        upDirection={!isSortedDesc}
      >
        <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
      </SortIconComponent>
    </SortIconHoverComponent>
  )
}

const SortIconComponent = styled.svg<{
  show: boolean
  hint: boolean
  upDirection: boolean
}>`
  opacity: ${({ show }) => (show ? 1 : 0)};
  color: ${({ hint, theme: { palette } }) =>
    palette.grey[hint ? '500' : palette.mode === 'dark' ? '200' : '900']};
  fill: currentColor;
  transform: rotate(${({ upDirection }) => (upDirection ? 0 : 180)}deg);
  transition: opacity 0.2s, color 0.4s, transform 0.3s;
  height: 80%;
  width: 80%;
  display: flex;
  align-items: center;
`

const ResizerComponent = styled.svg`
  color: #ddd;
  display: inline-block;
  fill: currentColor;
  font-size: 1.5rem;
  flex-shrink: 0;
  height: 1em;
  margin-left: auto;
  right: 0;
  touch-action: none; // prevents from scrolling while dragging on touch devices
  transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  user-select: none;
  width: 1em;
  z-index: 1;
`

const SmallCheckbox = styled(Checkbox).attrs({
  size: 'small'
})`
  && {
    padding: 0.4rem;
  }
`

const ReadOnlyCheckbox = styled(SmallCheckbox).attrs<{ checked: boolean }>({
  disabled: true
})`
  &&& {
    color: ${({ theme, checked }) =>
      checked
        ? theme.palette.primary.light
        : theme.palette.mode === 'dark'
        ? ''
        : theme.palette.grey['600']};
  }
`

const Resizer = (props: React.SVGAttributes<SVGElement>) => (
  <ResizerComponent
    {...props}
    onClick={
      e => e.stopPropagation() /* prevent sorting when clicking the resizer */
    }
  >
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
        Header: React.memo(({ getToggleAllRowsSelectedProps }) => {
          // exclude title from props
          const { title, ...toggleAllRowsProps } =
            getToggleAllRowsSelectedProps()
          return <SmallCheckbox {...toggleAllRowsProps} />
        }),
        Cell: React.memo(
          ({ row }: { row: UseRowSelectRowProps<DataStructure> }) => {
            // exclude title from props
            const { title, ...toggleRowProps } = row.getToggleRowSelectedProps()
            return <SmallCheckbox {...toggleRowProps} />
          }
        ),
        width: 40,
        minWidth: 40,
        disableSortBy: true,
        disableResizing: true
      },
      ...columns
    ]
  })
}

function filterFunction<D extends object>(
  rows: Array<Row<D>>,
  columnIds: Array<IdType<D>>,
  filterValue: string
): Array<Row<D>> {
  return rows.filter(row =>
    filterValue
      .trim()
      .split(/\W/)
      .every(word => {
        let wordMatch = false
        for (const column in row.values) {
          if (
            ['name', 'comments', ''].some(
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
    <DataGrid
      columns={columns}
      data={data}
      setData={setData}
      nonSortable={nonSortable}
      disableResize={disableResize}
      withGlobalFilter={withGlobalFilter}
    />
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
      minWidth: 70,
      width: 160,
      maxWidth: 700
    }),
    []
  )

  const {
    canNextPage,
    canPreviousPage,
    getTableProps,
    getTableBodyProps,
    gotoPage,
    headerGroups,
    nextPage,
    page,
    pageCount,
    pageOptions,
    prepareRow,
    previousPage,
    rows,
    selectedFlatRows,
    setColumnOrder,
    setGlobalFilter,
    setPageSize,
    state,
    state: { pageIndex, pageSize, globalFilter },
    toggleAllRowsSelected,
    visibleColumns
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
      globalFilter: filterFunction
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
      <TableControlSection>
        <ActionsContainer>
          {withGlobalFilter && (
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          )}
          {selectedFlatRows.length ? (
            <PrimaryButton
              onClick={() => {
                alert(
                  `inviting ${selectedFlatRows
                    .map(
                      r =>
                        r['cells'].find(c => c.column?.Header === 'Name')?.value
                    )
                    .join(', ')}`
                )
                toggleAllRowsSelected(false)
              }}
            >
              Invite
            </PrimaryButton>
          ) : null}
        </ActionsContainer>
        <Pagination
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          pageSize={pageSize}
          setPageSize={setPageSize}
          gotoPage={gotoPage}
          canPreviousPage={canPreviousPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          totalItems={rows.length}
        />
      </TableControlSection>
      <DragDropContext
        onDragStart={onDragStart}
        onDragUpdate={onDragUpdate}
        onDragEnd={onDragUpdate}
      >
        <Droppable droppableId="all-columns" direction="horizontal">
          {provided => (
            <DroppableTableContainer
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
                {page.map((row, i) => {
                  prepareRow(row)
                  return (
                    <TableRow {...row.getRowProps()} odd={i % 2 !== 0}>
                      {row.cells.map(cell => {
                        const cellValue = cell.render('Cell')
                        return (
                          <div
                            {...cell.getCellProps()}
                            style={{
                              ...cell.getCellProps().style,
                              display: ''
                            }}
                            className="td"
                          >
                            <TooltipOnOverflow
                              tooltip={
                                cell.column.id === 'selection' // manually exclude "selection" column
                                  ? ''
                                  : cellValue || ''
                              }
                            >
                              <DataGridCell>{cellValue}</DataGridCell>
                            </TooltipOnOverflow>
                          </div>
                        )
                      })}
                    </TableRow>
                  )
                })}
              </TableBody>
              {provided.placeholder}
            </DroppableTableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

function Pagination({
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
  gotoPage,
  canPreviousPage,
  previousPage,
  nextPage,
  canNextPage,
  pageCount,
  totalItems
}: {
  pageIndex: number
  pageOptions: number[]
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void
  pageSize: number
  setPageSize: (pageSize: number) => void
  canPreviousPage: any
  previousPage: () => void
  nextPage: () => void
  canNextPage: boolean
  pageCount: number
  totalItems: number
}) {
  const [pageInput, setPageInput] = React.useState<number | ''>(pageIndex + 1)
  React.useEffect(() => {
    setPageInput(pageIndex + 1)
  }, [pageIndex])

  const delayedGotoPage = useAsyncDebounce(value => {
    gotoPage(value)
  }, 100)

  return (
    <PaginationWrapper>
      <div>
        <span style={{ marginRight: '2ch' }}>Showing:</span>
        <CenteredSelect
          labelId="page-size"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
          variant="standard"
          disableUnderline
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
        </CenteredSelect>
      </div>
      <div>
        <span>
          {pageIndex * pageSize + 1}-
          {Math.min(pageIndex * pageSize + pageSize, totalItems)}
        </span>
        <span> of {totalItems}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => previousPage()} disabled={!canPreviousPage}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <PageInputTextField
          margin="none"
          value={pageInput}
          onChange={e => {
            // limit input to numbers or empty value, debounce the page turning
            if (
              !isNaN(+e.target.value) &&
              +e.target.value > 0 &&
              +e.target.value <= pageOptions.length
            ) {
              setPageInput(+e.target.value)
              delayedGotoPage(+e.target.value - 1)
              return
            }
            if (e.target.value === '') setPageInput('')
          }}
          onBlur={e => {
            // restore the value when it's empty and blurred.
            // Empty value is only allowed while editing the page number
            if (e.target.value === '') setPageInput(pageIndex + 1)
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowUp') previousPage()
            else if (e.key === 'ArrowDown') nextPage()
            else if (e.key === 'End') gotoPage(pageCount - 1)
            else if (e.key === 'Home') gotoPage(0)
            else return
            e.preventDefault()
          }}
        />
        <IconButton onClick={() => nextPage()} disabled={!canNextPage}>
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </PaginationWrapper>
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
  return <ReadOnlyCheckbox checked={value} size="small" />
}

const TooltippedDiv = styled.div`
  overflow: hidden;
`

function TooltipOnOverflow({
  children,
  tooltip,
  style
}: {
  children: React.ReactElement
  tooltip: NonNullable<React.ReactNode>
  style?: React.CSSProperties
}) {
  const ref = React.createRef<HTMLDivElement>()
  const [overflow, setOverflow] = React.useState(false)

  React.useEffect(() => {
    setOverflow(
      Math.abs(
        (ref.current?.firstElementChild as HTMLDivElement)?.offsetWidth -
          (ref.current?.firstElementChild?.scrollWidth || 0)
      ) > 1
    )
  }, [ref])

  return (
    <TooltippedDiv ref={ref} style={style}>
      {overflow ? <Tooltip title={tooltip}>{children}</Tooltip> : children}
    </TooltippedDiv>
  )
}
