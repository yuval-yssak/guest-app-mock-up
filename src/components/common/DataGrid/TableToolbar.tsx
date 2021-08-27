import React from 'react'
import GlobalFilter from './GlobalFilter'
import styled from 'styled-components'

const AlignToRight = styled.div`
  border: 1px solid #666;
  border-radius: 10px;
`

const TableToolbar = ({
  setGlobalFilter,
  globalFilter
}: {
  setGlobalFilter: (filterValue: string) => void
  globalFilter: string
}) => (
  <AlignToRight>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
  </AlignToRight>
)

export default TableToolbar
