import * as React from 'react'
import { FilterProps } from 'react-table'
import SearchBar from '../SearchBar'

export const ColumnFilter = ({
  column: { filterValue, setFilter }
}: FilterProps<{}>) => (
  <SearchBar
    searchTerm={filterValue}
    setSearchTerm={setFilter}
    hidePlaceHolder
  />
)
