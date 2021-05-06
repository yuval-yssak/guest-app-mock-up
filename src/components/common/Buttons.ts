import Button from '@material-ui/core/Button'
import styled from 'styled-components'

export const SecondaryButton = styled(Button).attrs({
  variant: 'outlined',
  size: 'small'
})``

export const PrimaryButton = styled(Button).attrs({
  variant: 'outlined',
  size: 'small',
  color: 'primary'
})`
  && {
    font-weight: 400;
  }
`
