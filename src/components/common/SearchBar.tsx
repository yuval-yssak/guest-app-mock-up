import * as React from 'react'
import styled from 'styled-components'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import { rgba } from 'polished'

const GreySearchIcon = styled(SearchIcon)`
  && {
    color: ${({ theme }) => theme.palette.grey['500']};
    height: 70%;
  }
`

const GreyClearIcon = styled(ClearIcon)`
  color: ${({ theme }) => theme.palette.grey['500']};
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

const SearchBarBackground = styled.div`
  align-items: center;
  background-color: ${({ theme: { palette } }) =>
    palette.grey[palette.mode === 'dark' ? '900' : '50']};
  border: ${({ theme: { palette } }) =>
    palette.mode === 'dark' && `1px solid ${rgba('white', 0.23)}`};
  border-radius: 10px;
  display: flex;
  height: 2rem;
  padding: 0 0.3rem 0 0.6rem;
  flex-basis: 20rem;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme: { palette } }) =>
      palette.mode === 'dark' && 'white'};
  }
`

const SearchBar = ({
  searchTerm,
  setSearchTerm
}: {
  searchTerm: string
  setSearchTerm: (newTerm: string) => void
}) => {
  return (
    <SearchBarBackground>
      <GreySearchIcon />
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
      {searchTerm && (
        <IconButton onClick={() => setSearchTerm('')}>
          <GreyClearIcon />
        </IconButton>
      )}
    </SearchBarBackground>
  )
}

export default SearchBar
