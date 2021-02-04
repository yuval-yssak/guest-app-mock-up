import styled from 'styled-components'

export default styled.div`
  && {
    display: grid;
    grid-template-rows: 1fr;
    align-items: center;
    width: min(60rem, 80%);
    background-color: transparent;

    @media (max-width: 36.5em) {
      width: 100%;
    }
  }
`
