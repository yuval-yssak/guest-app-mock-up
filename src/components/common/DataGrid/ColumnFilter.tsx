import * as React from 'react'
import { FilterProps } from 'react-table'
import { SearchBar, SearchBarRow } from '../SearchBar'

export const ColumnFilter = ({
  column: { filterValue, setFilter }
}: FilterProps<{}>) => (
  <SearchBarRow>
    <SearchBar
      searchTerm={filterValue}
      setSearchTerm={setFilter}
      hidePlaceHolder
    />
  </SearchBarRow>
)
