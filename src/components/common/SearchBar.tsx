import * as React from 'react'
import styled from 'styled-components'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'

export const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding-right: 0.3rem;
`

const StyledTextField = styled(Input)`
  flex: 1;

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
  return (
    <SearchBarRow>
      <StyledTextField
        disableUnderline
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.preventDefault()
            setSearchTerm('')
          }
        }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {searchTerm ? (
        <IconButton onClick={() => setSearchTerm('')}>
          <ClearIcon color="primary" />
        </IconButton>
      ) : (
        <SearchIcon color="primary" />
      )}
    </SearchBarRow>
  )
}
