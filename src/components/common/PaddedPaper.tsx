import styled from 'styled-components'
import Paper from '@material-ui/core/Paper'

const PaddedPaper = styled(Paper)<{ $opacity?: number }>`
  opacity: ${({ $opacity }) => ($opacity ? $opacity : 0.975)};
  padding: 1rem;
`

export default PaddedPaper
