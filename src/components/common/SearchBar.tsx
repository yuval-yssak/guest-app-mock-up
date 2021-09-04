import * as React from 'react'
import styled from 'styled-components'
import Input from '@material-ui/core/Input'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'

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

const AlignToRight = styled.div`
  align-items: center;
  border-radius: 10px;
  display: flex;
  height: 2rem;
  padding: 0 0.3rem 0 0.6rem;
  flex-basis: 20rem;
  background-color: ${({ theme: { palette } }) =>
    palette.grey[palette.mode === 'dark' ? '900' : '50']};
`

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  hidePlaceHolder
}: {
  searchTerm: string
  setSearchTerm: (newTerm: string) => void
  hidePlaceHolder?: boolean
}) => {
  return (
    <AlignToRight>
      <SearchIcon />
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
          <ClearIcon />
        </IconButton>
      )}
    </AlignToRight>
  )
}

export default SearchBar
