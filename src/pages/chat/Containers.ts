import styled from 'styled-components'
import {
  usersPaneWidth,
  minimumChatMessageWidth,
  inBetweenChatMessageWidth,
  maximumChatMessageWidth
} from './UsersPane'
import PageContentWrapper from '../../components/PageContentWrapper'

export const ChatPageContainer = styled(PageContentWrapper).attrs({
  className: 'chat-page-container'
})<{ staffView: boolean }>`
  overflow: hidden; // scrolling is only in the inner messages container
  grid-template-columns: ${props =>
    props.staffView
      ? `calc(
            (
              100vw - clamp(
                calc(${minimumChatMessageWidth} + ${usersPaneWidth}), 
                ${inBetweenChatMessageWidth}, 
                calc(${maximumChatMessageWidth} + ${usersPaneWidth})
              )
            ) / 2 + ${usersPaneWidth})
          1fr`
      : '1fr'};
  align-items: start;

  @media (max-width: 52em) {
    padding: 0 0.3rem;
  }
`

export const ChatContainer = styled.div.attrs({ className: 'chat-container' })<{
  staffView: boolean
}>`
  display: grid;
  align-content: end; // keep the user input at the bottom
  ${props => props.staffView && `padding-left: 2.5rem;`}

  // scrolling is only in the inner messages container
    overflow: hidden;
  height: 100%;

  // set widths for children
  & > * {
    ${({ staffView }) =>
      !staffView
        ? `
      padding: 0 calc(
        (
          100vw - clamp(
            ${minimumChatMessageWidth}, 
            ${inBetweenChatMessageWidth}, 
            ${maximumChatMessageWidth})
          ) / 2);
      `
        : `
      padding-right: calc(
        (
          100vw - clamp(
            calc(${minimumChatMessageWidth} + ${usersPaneWidth}),
            ${inBetweenChatMessageWidth},
            calc(${maximumChatMessageWidth} + ${usersPaneWidth})
          )
        ) / 2
      );
  `}
  }
`

export const MessagesScrollable = styled.div.attrs({
  className: 'messages-scrollable'
})`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: grid;
  grid-row-gap: 2rem;

  &:focus {
    outline: none;
  }
`
