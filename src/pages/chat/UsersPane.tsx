import React from 'react'
import styled from 'styled-components'
import { UserChatSnapshotType, UserChatType } from '../../models/ChatModel'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import InfiniteScroll from '../../components/common/infinite-scrolling/InfiniteScrolling'
import { generateRandomMessages, generateUsers } from '../../defaultStore'
import { useMst } from '../../models/reactHook'
import { observer } from 'mobx-react-lite'

export const usersPaneWidth = '30rem'
export const minimumChatMessageWidth = '40rem'
export const inBetweenChatMessageWidth = '90vw'
export const maximumChatMessageWidth = '60rem'

const UsersPaneContainer = styled.div.attrs({
  className: 'users-pane-container'
})`
  height: 100%;
  overflow-y: hidden;
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

const User = observer(({ userChat }: { userChat: UserChatType }) => {
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
        (store.view.id === undefined &&
          userChat.user.id === store.loggedInUser!.id)
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
                ].content.slice(0, 20)}
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
})

function UsersPaneComponent() {
  const store = useMst()

  const containerDomRef = React.createRef<HTMLDivElement>()
  const [containerHeight, setContainerHeight] = React.useState(0)

  // track divHeight whenever DOM element changes
  React.useEffect(() => {
    function setHeight() {
      if (containerDomRef.current) {
        if (containerDomRef.current.clientHeight !== containerHeight)
          setContainerHeight(containerDomRef.current.clientHeight)
      }
    }

    // get initial container height
    setHeight()

    // track DOM changes to container height
    if (containerDomRef.current) {
      const observer = new ResizeObserver(setHeight)
      observer.observe(containerDomRef.current)
      return () => {
        observer.disconnect()
      }
    }
  }, [containerDomRef, containerHeight])

  function loadNext() {
    setTimeout(() => {
      const newUsers = generateUsers(25, store.users.length + 1)
      const chats = newUsers.map<UserChatSnapshotType>(user => ({
        user: user.id,
        chat: {
          messages: generateRandomMessages(
            newUsers,
            user.id
          ) as UserChatSnapshotType['chat']['messages'],
          lastReadTimestamp: 0
        }
      }))
      store.addUsers(newUsers)
      store.chats.addUserChats(chats)
    }, 3000)
  }

  return (
    <UsersPaneContainer ref={containerDomRef}>
      <InfiniteScroll
        dataLength={store.chats.withUsers?.length || 0}
        hasMore={
          (store.chats.withUsers && store.chats.withUsers.length < 100) || false
        }
        loader={<LinearProgress />}
        next={loadNext}
        height={
          containerHeight - 1 - 4 /* 4px is the height of the Progress bar */
        }
      >
        <>
          <User
            key={store.loggedInUser!.id}
            userChat={{
              user: store.loggedInUser!,
              chat: store.chats.withSelf
            }}
          />
          {store.chats.withUsers?.map(userChat => (
            <User key={userChat.user.id} userChat={userChat} />
          ))}
        </>
      </InfiniteScroll>
    </UsersPaneContainer>
  )
}

export const UsersPane = observer(UsersPaneComponent)
