import * as React from 'react'
import styled from 'styled-components'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'

export const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

const StyledTextField = styled(Input)`
  flex: 1;
  margin-left: 4rem;

  & input {
    text-align: inherit;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  // hide the black underline when there is no search input
  & .MuiInput-underline::before {
    ${({ value }) => value === '' && `opacity: 0;`}
  }
`

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  hidePlaceHolder
}: {
  searchTerm: string
  setSearchTerm: (newTerm: string) => void
  hidePlaceHolder?: boolean
}) => {
  const [hovering, setHovering] = React.useState(false)

  return (
    <SearchBarRow>
      <StyledTextField
        type="search"
        disableUnderline
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.preventDefault()
            setSearchTerm('')
          }
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <SearchIcon />
    </SearchBarRow>
  )
}
