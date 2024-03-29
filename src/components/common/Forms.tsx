import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

// A line wrapper in a form
export const Wrapper = styled.div.attrs({ className: 'line-wrapper' })<{
  disableColumnGap?: boolean
  bottomSpacing?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  column-gap: ${({ disableColumnGap }) => !disableColumnGap && '2rem'};
  row-gap: 1rem;
  transition: all 0.2s;

  &:not(:last-child) {
    margin-bottom: ${({ bottomSpacing }) => bottomSpacing && '1.2rem'};
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
    margin-bottom: 0.6rem;

    & .MuiOutlinedInput-notchedOutline {
      border-color: rgba(0, 0, 0, 0.15);
    }
  }
`

export const FormError = styled(Typography).attrs({
  className: 'form-error',
  variant: 'body2'
})`
  color: ${({ theme }) => theme.palette.grey['500']};
  && {
    font-size: 0.8rem;
  }
  position: absolute;
  bottom: 0.4rem;
  transform: translateY(100%);
`
