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

export const StyledFormControlLabel = styled(FormControlLabel)`
  color: ${({ theme: { palette } }) =>
    palette.grey[palette.mode === 'dark' ? '400' : '900']};
`

// A "Field" contains the field and its error message
export const Field = styled.div.attrs({ className: 'form-field' })`
  position: relative;
  flex: 1;
`

// give room for error message
export const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 0.8rem;
  }
`

export const DateTimeTextField = styled(TextField)`
  && {
    min-width: 15rem;
    margin-bottom: 0.8rem;
  }
`

export const FormError = styled(Typography).attrs({
  className: 'form-error',
  variant: 'body2'
})`
  color: ${({ theme }) => theme.palette.secondary.dark};
  position: absolute;
  bottom: 0.7rem;
  transform: translateY(100%);
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
  width: clamp(14.5rem, 80%, 60rem);
  margin-top: 1rem;
`

// A line wrapper in a form
export const Wrapper = styled.div.attrs({ className: 'line-wrapper' })<{
  $alignToRight?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  ${({ $alignToRight }) =>
    $alignToRight &&
    `
      justify-content: flex-end;
      column-gap: 0.5rem;
      row-gap: 0.5rem;
      
  `}
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
