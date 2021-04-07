import React from 'react'
import styled from 'styled-components'
import { UserChatType } from '../../models/ChatModel'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import { useMst } from '../../models/reactHook'

export const usersPaneWidth = '30rem'
export const minimumChatMessageWidth = '40rem'
export const inBetweenChatMessageWidth = '90vw'
export const maximumChatMessageWidth = '60rem'

const UsersPaneContaner = styled.div.attrs({
  className: 'users-pane-container'
})`
  height: 100%;
  overflow-y: auto;
  padding-top: 0.4rem;
  padding-bottom: 4rem;
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
`

const StyledUser = styled.div.attrs({ className: 'user' })<{
  selected: boolean
}>`
  display: flex;
  align-items: center;

  padding-left: 0.5rem;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;

  height: 4.5rem;
  background-color: ${({ theme: { palette }, selected }) =>
    palette.type === 'dark' && selected
      ? palette.grey['300']
      : palette.type === 'dark' && !selected
      ? palette.grey['700']
      : palette.type === 'light' && selected
      ? palette.grey['200']
      : palette.grey['50']};
  color: ${({ theme: { palette } }) =>
    palette.type === 'dark' ? '#fff' : palette.primary.contrastText};
  border-top: 1px solid ${({ theme }) => theme.palette.grey['300']};
  border-left: 1px solid ${({ theme }) => theme.palette.grey['300']};
  border-right: 1px solid ${({ theme }) => theme.palette.grey['300']};
  padding-right: 0.5rem;

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey['300']};
  }

  &:hover {
    background-color: ${({ theme }) => theme.palette.grey['200']};
  }
`

const StyledUserAvatar = styled(Avatar).attrs({ className: 'user__avatar' })`
  && {
    width: 3.3rem;
    height: 3.3rem;
  }
`

//todo: this function has a duplicate in Messages.tsx
const UserAvatar = ({ src, name }: { src: string; name: string }) => {
  if (src) return <StyledUserAvatar alt="user avatar" src={src} />
  else
    return (
      <StyledUserAvatar alt="user avatar">
        {getNameInitials(name)}
      </StyledUserAvatar>
    )
}

//todo: this function has a duplicate in Messages.tsx
function getNameInitials(name: string) {
  return name
    .split(/\s/)
    .map(word => word[0])
    .join('')
}

const StyledUserName = styled(Typography).attrs({ className: 'user__name' })`
  && {
    font-weight: 500;
  }
`

const TimeSignature = styled(Typography).attrs({
  className: 'user__last-message-time'
})`
  && {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.palette.grey['700']};
  }
`

const LastMessageContent = styled.div.attrs({
  className: 'user__last-message-content'
})`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.grey['700']};

  & > :first-child {
    margin-right: 1ch; // one-letter's width margin
  }

  & > :last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const MiddleSection = styled.div.attrs({ className: 'user__middle-section' })`
  overflow: hidden;
  margin: 0 0.4rem;
  flex-grow: 1;
`

function User({ userChat }: { userChat: UserChatType }) {
  const store = useMst()
  return (
    <StyledUser
      onClick={() =>
        store.view.openChatPage(
          userChat.user === store.loggedInUser
            ? undefined
            : userChat.user.id.toString()
        )
      }
      selected={
        userChat.user.id === +store.view.id! ||
        (userChat.user.id === store.loggedInUser!.id &&
          store.view.id === undefined)
      }
    >
      <UserAvatar
        src={userChat.user.imageSrc}
        name={userChat.user.personName}
      />
      <MiddleSection>
        <StyledUserName>{userChat.user.personName}</StyledUserName>
        {userChat.chat.orderedMessages.length ? (
          <>
            <LastMessageContent>
              <Typography variant="body1">
                {
                  userChat.chat.orderedMessages[
                    userChat.chat.orderedMessages.length - 1
                  ].user.personName.split(/\s/)[0]
                }
                :
              </Typography>
              <Typography variant="body2">
                {userChat.chat.orderedMessages[
                  userChat.chat.orderedMessages.length - 1
                ].content.slice(0, 80)}
              </Typography>
            </LastMessageContent>
          </>
        ) : (
          <></>
        )}
      </MiddleSection>
      {userChat.chat.orderedMessages.length ? (
        <TimeSignature>
          {
            userChat.chat.orderedMessages[
              userChat.chat.orderedMessages.length - 1
            ].timeSignature
          }
        </TimeSignature>
      ) : (
        <></>
      )}
    </StyledUser>
  )
}

export function UsersPane() {
  const store = useMst()
  return (
    <UsersPaneContaner>
      <>
        <User
          key={store.loggedInUser!.id}
          userChat={{ user: store.loggedInUser!, chat: store.chats.withSelf }}
        />
        {store.chats.withUsers?.map(userChat => (
          <User key={userChat.user.id} userChat={userChat} />
        ))}
      </>
    </UsersPaneContaner>
  )
}
