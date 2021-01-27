import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'

export default styled(Typography)`
  && {
    text-align: center;
    font-size: 3rem;

    @media (max-width: 24em) {
      font-size: 2rem;
      font-weight: 800;
    }

    @media (max-width: 18em) {
      font-size: 1.5rem;
    }
  }
`
