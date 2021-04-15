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
import TextField from '@material-ui/core/TextField'

export const usersPaneWidth = '30rem'
export const minimumChatMessageWidth = '40rem'
export const inBetweenChatMessageWidth = '90vw'
export const maximumChatMessageWidth = '60rem'

const UsersPaneContainer = styled.div.attrs({
  className: 'users-pane-container'
})`
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-gap: 0.8rem;
  padding-top: 0.4rem;
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

const StyledSearchbar = styled(TextField).attrs({ type: 'search' })`
  border: 0.02rem solid ${({ theme }) => theme.palette.grey['300']};
  padding: 0.3rem 1.5rem;
  border-radius: 1rem;
`

const UsersScrollable = styled.div.attrs({ className: 'users-scrollable' })`
  width: 100%;
  overflow: hidden;
`

const User = observer(({ userChat }: { userChat: UserChatType }) => {
  const store = useMst()

  const lastUserName = userChat.chat.unreadCount
    ? getLastReadMessage()?.user.personName.split(/\s/)[0]
    : getLastMessage().user.personName.split(/\s/)[0]

  const lastMessageContent = userChat.chat.unreadCount
    ? getLastReadMessage()?.content.slice(0, 80)
    : getLastMessage().content.slice(0, 80)

  function getLastReadMessage() {
    return userChat.chat.orderedMessages.find(
      m => m.timestamp > userChat.chat.lastReadTimestamp
    )
  }

  function getLastMessage() {
    return userChat.chat.orderedMessages[
      userChat.chat.orderedMessages.length - 1
    ]
  }

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
              <Typography
                variant="body1"
                {...(userChat.chat.unreadCount && {
                  style: { fontWeight: 700 }
                })}
              >
                {lastUserName}:
              </Typography>
              <Typography
                variant="body2"
                {...(userChat.chat.unreadCount && {
                  style: { fontWeight: 700 }
                })}
              >
                {lastMessageContent}
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
  const [searchTerm, setSearchTerm] = React.useState('')

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
    <UsersPaneContainer>
      <StyledSearchbar
        placeholder="Search users"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.preventDefault()
            setSearchTerm('')
          }
        }}
      >
        Search bar
      </StyledSearchbar>
      <UsersScrollable ref={containerDomRef}>
        <InfiniteScroll
          dataLength={store.chats.withUsers?.length || 0}
          hasMore={
            (store.chats.withUsers && store.chats.withUsers.length < 100) ||
            false
          }
          loader={<LinearProgress />}
          next={loadNext}
          height={containerHeight}
        >
          <>
            <User
              key={store.loggedInUser!.id}
              userChat={{
                user: store.loggedInUser!,
                chat: store.chats.withSelf
              }}
            />
            {store.chats.withUsers
              ?.filter(userChat => {
                if (!searchTerm.trim()) return true
                return userChat.user.personName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              })
              .map(userChat => (
                <User key={userChat.user.id} userChat={userChat} />
              ))}
          </>
        </InfiniteScroll>
      </UsersScrollable>
    </UsersPaneContainer>
  )
}

export const UsersPane = observer(UsersPaneComponent)
