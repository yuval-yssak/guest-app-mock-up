import styled from 'styled-components'

export default styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 1fr;
  align-items: center;
  grid-template-columns: min(60rem, 80%);
  justify-content: center;
  background-color: transparent;

  @media (max-width: 36.5em) {
    grid-template-columns: 100%;
  }
`
