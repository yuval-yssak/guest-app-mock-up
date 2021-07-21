import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

export const usersPaneWidth = '30rem'
export const minimumChatMessageWidth = '40rem'
export const inBetweenChatMessageWidth = '90vw'
export const maximumChatMessageWidth = '60rem'

export const UsersPaneContainer = styled.section.attrs({
  className: 'users-pane-container'
})`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-left: calc(
    (
        100vw -
          clamp(
            calc(${minimumChatMessageWidth} + ${usersPaneWidth}),
            ${inBetweenChatMessageWidth},
            calc(${maximumChatMessageWidth} + ${usersPaneWidth})
          )
      ) / 2
  );

  & > .infinite-scroll-component__outerdiv {
    width: 100%;
    overflow: hidden;
  }
`

export const List = styled.ul`
  list-style-type: none;
`

export const StyledUser = styled.div.attrs({ className: 'user' })<{
  selected: boolean
}>`
  display: flex;
  align-items: center;

  padding-left: 0.5rem;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;

  height: 5.8rem;
  background-color: ${({ theme: { palette }, selected }) =>
    palette.mode === 'dark' && selected
      ? palette.grey['300']
      : palette.mode === 'dark' && !selected
      ? palette.grey['700']
      : palette.mode === 'light' && selected
      ? palette.grey['200']
      : palette.grey['50']};
  color: ${({ theme: { palette } }) =>
    palette.mode === 'dark' ? '#fff' : palette.primary.contrastText};
  border-top: 1px solid ${({ theme }) => theme.palette.grey['100']};
  border-left: 1px solid ${({ theme }) => theme.palette.grey['100']};
  border-right: 1px solid ${({ theme }) => theme.palette.grey['100']};
  padding-right: 0.5rem;

  &:last-child {
    /* border-bottom: 1px solid ${({ theme }) => theme.palette.grey['300']}; */
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey['200']};
  }
`

export const StyledUserAvatar = styled(Avatar).attrs({
  className: 'user__avatar'
})`
  && {
    width: 3.3rem;
    height: 3.3rem;
  }
`

export const StyledUserName = styled(Typography).attrs({
  className: 'user__name'
})<{ $unread: boolean }>`
  && {
    font-weight: ${({ $unread }) => ($unread ? 500 : 300)};
    line-height: 1;
  }
`

export const TimeSignature = styled(Typography).attrs({
  className: 'user__last-message-time'
})`
  && {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.palette.grey['700']};
    grid-row: 1/2;
    grid-column: 2/3;
  }
`

export const LastMessageContent = styled.div.attrs({
  className: 'user__last-message-content'
})`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.grey['700']};
  grid-row: 2/3;
  grid-column: 1/-1;

  & > :first-child {
    margin-right: 1ch; // one-letter's width margin
  }

  & > :last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const UserTeaser = styled.div.attrs({
  className: 'user__user-teaser'
})`
  overflow: hidden;
  margin: 0 0.4rem;
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: end;
  grid-row-gap: 0.4rem;
`
