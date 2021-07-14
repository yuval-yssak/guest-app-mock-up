import React from 'react'
import styled from 'styled-components'
import { UserChatSnapshotType } from '../../models/ChatModel'
import Avatar from '@material-ui/core/Avatar'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InfiniteScroll from '../../components/common/infinite-scrolling/InfiniteScrolling'
import { generateRandomMessages, generateUsers } from '../../defaultStore'
import { useMst } from '../../models/reactHook'
import { observer } from 'mobx-react-lite'
import { isElementInViewport } from '../../components/common/isElementInViewport'

export const usersPaneWidth = '30rem'
export const minimumChatMessageWidth = '40rem'
export const inBetweenChatMessageWidth = '90vw'
export const maximumChatMessageWidth = '60rem'

const UsersPaneContainer = styled.section.attrs({
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

const List = styled.ul`
  list-style-type: none;
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
    palette.mode === 'dark' && selected
      ? palette.grey['300']
      : palette.mode === 'dark' && !selected
      ? palette.grey['700']
      : palette.mode === 'light' && selected
      ? palette.grey['200']
      : palette.grey['50']};
  color: ${({ theme: { palette } }) =>
    palette.mode === 'dark' ? '#fff' : palette.primary.contrastText};
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

const StyledSearchbar = styled(TextField).attrs({ type: 'search' })<{
  value: unknown // https://material-ui.com/guides/typescript/#handling-value-and-event-handlers
}>`
  // place the placeholder in the center when there is no search term.
  text-align: ${({ value }) => (value === '' ? `center` : `initial`)};
  width: 100%;

  & input {
    text-align: inherit;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  // hide the black underline when there is no search input
  & .MuiInput-underline::before {
    ${({ value }) => value === '' && `opacity: 0;`}
  }
`

const User = observer(
  ({ id, switchToChatView }: { id: string; switchToChatView?: () => void }) => {
    const store = useMst()
    const domRef = React.createRef<HTMLDivElement>()
    const selected = (store.view.id || '') === id
    const [firstRender, setFirstRender] = React.useState(true)

    React.useEffect(() => {
      setImmediate(() => {
        if (
          domRef.current &&
          selected &&
          firstRender &&
          !isElementInViewport(domRef.current)
        )
          domRef.current.scrollIntoView({ block: 'center' })
      })
    }, [domRef, selected, id, firstRender])

    React.useEffect(
      // after initial load - do not allow jumping of the scrolling position
      () => {
        setTimeout(() => {
          setFirstRender(false)
        }, 1000)
      },
      []
    )

    const chat = id
      ? store.chats.withUsers!.find(uc => uc.user.id === +id)!.chat
      : store.chats.withSelf

    const lastUserName = chat.unreadCount
      ? getLastReadMessage()?.user.personName.split(/\s/)[0]
      : getLastMessage().user.personName.split(/\s/)[0]

    const lastMessageContent = chat.unreadCount
      ? getLastReadMessage()?.content.slice(0, 80)
      : getLastMessage().content.slice(0, 80)

    function getLastReadMessage() {
      return chat.orderedMessages.find(
        m => m.timestamp > chat.lastReadTimestamp
      )
    }

    function getLastMessage() {
      return chat.orderedMessages[chat.orderedMessages.length - 1]
    }

    return (
      <li>
        <StyledUser
          onClick={() => {
            switchToChatView?.()
            store.view.openChatPage(id)
          }}
          selected={selected}
          ref={domRef}
        >
          <UserAvatar
            src={
              id
                ? store.users.find(user => user.id === +id)!.imageSrc
                : store.loggedInUser!.imageSrc
            }
            name={
              id
                ? store.users.find(user => user.id === +id)!.personName
                : store.loggedInUser!.personName
            }
          />
          <MiddleSection>
            <StyledUserName>
              {store.users.find(user => user.id === +id)?.personName}
            </StyledUserName>
            {chat.orderedMessages.length ? (
              <>
                <LastMessageContent>
                  <Typography
                    variant="body1"
                    {...(chat.unreadCount && {
                      style: { fontWeight: 700 }
                    })}
                  >
                    {lastUserName}:
                  </Typography>
                  <Typography
                    variant="body2"
                    {...(chat.unreadCount && {
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
          {chat.orderedMessages.length ? (
            <TimeSignature>
              {
                chat.orderedMessages[chat.orderedMessages.length - 1]
                  .timeSignature
              }
            </TimeSignature>
          ) : (
            <></>
          )}
        </StyledUser>
      </li>
    )
  }
)

function UsersPaneComponent({
  switchToChatView
}: {
  switchToChatView?: () => void
}) {
  const store = useMst()

  const containerDomRef = React.createRef<HTMLDivElement>()
  const [containerHeight, setContainerHeight] = React.useState(0)
  const [searchTerm, setSearchTerm] = React.useState('')

  const usersArray = [''].concat(
    store.chats.withUsers!.map(uc => uc.user.id.toString())
  )

  const filteredUsersArray = usersArray.filter(userID => {
    if (!searchTerm.trim()) return true
    return (
      !userID ||
      store.users
        .find(u => u.id === +userID)!
        .personName.toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  })

  // track divHeight whenever DOM element changes or number of items
  // changes so that they amount to less than the full height of the container.
  React.useEffect(() => {
    function setHeight() {
      if (containerDomRef.current) {
        const calculatedTotalHeight = Array.from(
          containerDomRef.current.firstElementChild?.firstElementChild
            ?.children || []
        ).reduce((a, c) => a + c.clientHeight, 0)

        // check if the total children height is less than the container.
        if (
          calculatedTotalHeight <
          (containerDomRef.current.parentElement?.clientHeight || 0)
        ) {
          // if so - set the scrolling height to the total children height.
          setContainerHeight(calculatedTotalHeight)
          // when container height changes, set the scrolling height accordingly
        } else if (containerDomRef.current.clientHeight !== containerHeight)
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
  }, [containerDomRef, containerHeight, searchTerm])

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
    }, 2000)
  }

  return (
    <UsersPaneContainer ref={containerDomRef} role="navigation">
      <InfiniteScroll
        dataLength={store.chats.withUsers?.length || 0}
        hasMore={
          (store.chats.withUsers && store.chats.withUsers.length < 100) || false
        }
        loader={<LinearProgress />}
        next={loadNext}
        height={containerHeight - 1}
      >
        <StyledSearchbar
          placeholder="🔍"
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
        <List
          tabIndex={0}
          onKeyDown={e => {
            // navigate up & down via the arrow keys
            const selectedUserIndex = filteredUsersArray.findIndex(
              id => id === store.view.id
            )

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              switchToChatView?.()

              if (selectedUserIndex === 0 && e.key === 'ArrowUp')
                store.view.openChatPage()
              else {
                const nextId =
                  filteredUsersArray[
                    selectedUserIndex + 1 * (e.key === 'ArrowUp' ? -1 : 1)
                  ]
                if (nextId) {
                  store.view.openChatPage(nextId)
                }
              }
            }
          }}
        >
          {filteredUsersArray.map(id => (
            <User
              key={id || store.loggedInUser!.id}
              id={id}
              switchToChatView={switchToChatView}
            />
          ))}
        </List>
      </InfiniteScroll>
    </UsersPaneContainer>
  )
}

export const UsersPane = observer(UsersPaneComponent)
