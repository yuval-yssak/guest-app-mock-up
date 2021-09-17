import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

// A line wrapper in a form
export const Wrapper = styled.div.attrs({ className: 'line-wrapper' })<{
  disableColumnGap?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  column-gap: ${({ disableColumnGap }) => !disableColumnGap && '2rem'};
  row-gap: 1rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

// A "Field" contains the field and its error message
export const Field = styled.div.attrs({
  className: 'form-field'
})<{ minimumDesiredWidth?: string }>`
  position: relative;
  flex: 1;
  flex-basis: ${({ minimumDesiredWidth }) => minimumDesiredWidth};
  flex-shrink: ${({ minimumDesiredWidth }) => minimumDesiredWidth && 0};
`

// give room for error message
export const FormTextField = styled(TextField)`
  && {
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
