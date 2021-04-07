import styled from 'styled-components'

const messageScrollableColumnGridGap = '0.5rem'

const DateMessages = styled.div.attrs({
  className: 'date-messages'
})`
  word-break: break-word;

  display: grid;
  background-color: transparent;

  width: 100%;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(20, 1fr);
  justify-content: center;
  align-items: end;
  grid-column-gap: ${messageScrollableColumnGridGap};
  grid-row-gap: 2rem;

  @media (max-width: 52em) {
    grid-template-columns: repeat(
      20,
      calc((90% - ${messageScrollableColumnGridGap} * 19) / 20)
    );
    padding: 0 0.3rem;
  }

  @media (max-width: 32.5em) {
    grid-template-columns: repeat(
      20,
      calc((100% - ${messageScrollableColumnGridGap} * 19) / 20)
    );
  }

  & + & {
    margin-top: 3rem;
  }
`

export default DateMessages
