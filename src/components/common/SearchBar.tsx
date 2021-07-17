import * as React from 'react'
import styled from 'styled-components'
import TextField from '@material-ui/core/TextField'

export const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
`

const StyledTextField = styled(TextField)`
  // place the placeholder in the center when there is no search term.
  text-align: ${({ value }) => (value === '' ? `center` : `initial`)};
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
  const [hovering, setHovering] = React.useState(false)

  return (
    <StyledTextField
      type="search"
      variant="standard"
      placeholder={hidePlaceHolder && !hovering ? '' : '🔍'}
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
  )
}
