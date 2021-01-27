import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'

export const mainGridGap = '2rem'
export default styled(Paper)`
  && {
    padding: 2rem 3rem;
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-gap: ${mainGridGap};
    align-items: center;
    max-width: min(70rem, 80%);
    background-color: transparent;

    @media (max-width: 36.5em) {
      padding: 1.5rem 1rem;
      max-width: 100%;
    }
  }
`
