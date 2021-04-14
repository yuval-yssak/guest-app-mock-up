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
  overflow-y: auto;
  grid-template-columns: ${({ staffView }) =>
    staffView
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
  align-items: stretch;
  /* height: 50%; */
  @media (max-width: 52em) {
    padding: 0 0.3rem;
  }
`

export const ChatContainer = styled.div.attrs({ className: 'chat-container' })<{
  staffView: boolean
}>`
  display: grid;
  grid-template-rows: 1fr max-content;

  ${props => props.staffView && `padding-left: 2.5rem;`};

  // scrolling is only in the inner messages container
  overflow-y: auto;
  height: 100%;

  // set widths for children on guest view
  ${({ staffView }) =>
    !staffView &&
    `
  & :is(.user-input-section, .infinite-scroll-component) {
    padding: 0 calc(
      (
        100vw - clamp(
          ${minimumChatMessageWidth}, 
          ${inBetweenChatMessageWidth}, 
          ${maximumChatMessageWidth}
        )
      ) / 2
    );
  }
  `}
`

export const MessagesScrollable = styled.div.attrs({
  className: 'messages-scrollable'
})<{ staffView: boolean }>`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: grid;
  grid-row-gap: 2rem;

  &:focus {
    outline: none;
  }

  & .infinite-scroll-component {
    ${({ staffView }) =>
      staffView &&
      `
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
