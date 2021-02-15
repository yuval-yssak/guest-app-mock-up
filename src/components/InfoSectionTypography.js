import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import PageContentWrapper from './PageContentWrapper'

export const Article = styled(PageContentWrapper).attrs({
  className: 'scrollable'
})`
  && {
    overflow-y: scroll;
    color: ${({ theme }) =>
      theme.palette.grey[theme.palette.type === 'dark' ? '50' : '800']};

    align-items: end;
    box-sizing: content-box;

    @media (max-width: 40em) {
      grid-template-columns: 90%;
    }
  }
`

export const Heading1 = styled(Typography).attrs({ variant: 'h1' })`
  && {
    margin: 1rem 0 0.6rem;
  }
`

export const Heading2 = styled(Typography).attrs({ variant: 'h2' })`
  && {
    margin: 1rem 0 0.6rem;
  }
`

export const Heading3 = styled(Typography).attrs({ variant: 'h3' })`
  && {
    &:not(&:first-of-type) {
      margin: 0.8rem 0 0.15rem;
    }
  }

  & + p {
    margin-top: 0;
  }
`

export const Heading4 = styled(Typography).attrs({ variant: 'h4' })`
  && {
    &:not(&:first-of-type) {
      margin: 0.8rem 0 0.15rem;
    }
  }

  & + p {
    margin-top: 0;
  }
`

export const Paragraph = styled(Typography).attrs({ variant: 'body1' })`
  && {
    line-height: 1.3;

    &&& + h2,
    &&& + h3 {
      margin-top: 1rem;
    }
  }

  &:not(&:first-of-type) {
    margin-top: 0.5rem;
  }
`

export const LeadText = styled(Typography).attrs({ variant: 'body1' })`
  &&& {
    font-weight: 500;
    line-height: 1.2;
    margin-top: 0;
  }
`
