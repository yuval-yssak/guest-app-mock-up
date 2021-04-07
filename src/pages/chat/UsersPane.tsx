import React from 'react'
import styled from 'styled-components'
import { UserChatType } from '../../models/ChatModel'
import Typography from '@material-ui/core/Typography'
import { useMst } from '../../models/reactHook'

export const usersPaneWidth = '30rem'
export const minimumChatMessageWidth = '40rem'
export const inBetweenChatMessageWidth = '90vw'
export const maximumChatMessageWidth = '60rem'

const UsersPaneContaner = styled.div`
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
  padding-right: 0.5rem;
`

const StyledUser = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 1rem;
  align-items: center;
  padding-left: 0.5rem;
  cursor: pointer;

  height: 4.5rem;
  background-color: ${({ theme: { palette } }) =>
    palette.type === 'dark' ? palette.grey['700'] : palette.grey['50']};
  color: ${({ theme: { palette } }) =>
    palette.type === 'dark' ? '#fff' : palette.primary.contrastText};
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  display: grid;

  &:last-child {
    border-bottom: 1px solid #ddd;
  }

  &:hover {
    background-color: #ddd;
  }
`

const StyledUserAvatar = styled.img`
  height: 4rem;
  width: auto;
  border-radius: 50%;
  grid-row: 1/-1;
`

const StyledUserName = styled(Typography)`
  && {
    font-weight: 500;
  }
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
    >
      <StyledUserAvatar src={userChat.user.imageSrc} aria-hidden />
      <StyledUserName>{userChat.user.personName}</StyledUserName>
      {userChat.chat.messages.length ? (
        <>
          <Typography>
            {
              userChat.chat.messages[userChat.chat.messages.length - 1].user
                .personName
            }
            :{' '}
          </Typography>
          <Typography>
            {userChat.chat.messages[
              userChat.chat.messages.length - 1
            ].content.slice(0, 10)}
          </Typography>
        </>
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
