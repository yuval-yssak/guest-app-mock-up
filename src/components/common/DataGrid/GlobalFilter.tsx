import * as React from 'react'
import { useAsyncDebounce } from 'react-table'
import { SearchBar, SearchBarRow } from '../SearchBar'

const GlobalFilter = ({
  filter,
  setFilter
}: {
  filter: string
  setFilter: (filterValue: string) => void
}) => {
  const [value, setValue] = React.useState(filter)

  const onChangeDebounced = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 100)

  const onChange = (newTerm: string) => {
    setValue(newTerm)
    onChangeDebounced(newTerm)
  }

  return (
    <SearchBarRow>
      <SearchBar searchTerm={value} setSearchTerm={onChange} />
    </SearchBarRow>
  )
}

export default GlobalFilter
