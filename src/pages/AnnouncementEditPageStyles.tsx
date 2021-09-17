import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemButton from '@material-ui/core/ListItemButton'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { PrimaryButton } from '../components/common/Buttons'
import styled from 'styled-components'
import { rgba } from 'polished'

export const StyledFormControlLabel = styled(FormControlLabel)`
  border: 1px solid
    ${({ theme }) =>
      rgba(theme.palette.mode === 'dark' ? 'white' : 'black', 0.23)};
  border-radius: 4px;
  padding: 0 0.5rem 0 0;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme: { palette } }) =>
      palette.mode === 'dark' ? 'white' : 'black'};
  }
`

export const DateTimeTextField = styled(TextField)`
  && {
    margin-bottom: 0.8rem;
  }
`

export const StyledListSubheader = styled(ListSubheader).attrs({
  disableSticky: true
})<{ $secondary?: boolean }>`
  && {
    color: #aaa;
    ${({ $secondary }) => $secondary && `margin-left: 1rem;`}
  }
`

export const NewAnnouncementWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: clamp(min(100vw, 16rem), 80%, 60rem);
  justify-self: center;
  margin-top: 1rem;
`

export const StyledInput = styled(Input)`
  && {
    margin-bottom: 0.8rem;
    cursor: pointer;
  }

  && input,
  && .MuiInputAdornment-root,
  && .MuiInputBase-root {
    cursor: pointer;
  }
`

export const AudienceInputLabel = styled(InputLabel)`
  width: 100%;
`

export const MultilineListItem = styled(ListItemButton)<{
  selected: boolean
}>`
  && {
    white-space: normal;
    display: flex;
    column-gap: 0.5rem;
    background-color: ${({ selected, theme: { palette } }) =>
      selected
        ? palette.mode === 'light'
          ? palette.grey['200']
          : palette.grey['800']
        : 'inherit'};
  }

  &:hover {
    background-color: ${({ theme: { palette } }) =>
      palette.mode === 'light' ? palette.grey['200'] : palette.grey['800']};
  }
`

export const ElevatedPaper = styled(Paper).attrs({ elevation: 2 })`
  margin: 1rem;
  padding: 1rem;
`

export const AudienceSegmentName = styled(Typography).attrs({
  variant: 'body1'
})`
  flex: 1;
`

export const AudienceCountChip = styled(Chip).attrs({
  color: 'primary',
  variant: 'outlined'
})``

export const PrimaryButtonWithMargin = styled(PrimaryButton)`
  && {
    margin: 1rem;
    margin-top: 0;
  }
`

export const FormBottomFields = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
`

export const FormBottomButtons = styled(FormBottomFields)`
  justify-content: end;
  flex-grow: 1;

  @media (max-width: 14.5em) {
    flex-direction: column;
    align-items: stretch;
  }
`
