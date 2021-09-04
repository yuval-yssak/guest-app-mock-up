import * as React from 'react'
import { UserChatSnapshotType } from '../../models/ChatModel'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import InfiniteScroll from '../../components/common/infinite-scrolling/InfiniteScrolling'
import { generateRandomMessages, generateUsers } from '../../defaultStore'
import { useMst } from '../../models/reactHook'
import { observer } from 'mobx-react-lite'
import { isElementInViewport } from '../../components/common/isElementInViewport'
import SearchBar from '../../components/common/SearchBar'
import styled from 'styled-components'

import {
  List,
  StyledUser,
  StyledUserAvatar,
  UsersPaneContainer,
  LastMessageContent,
  UserTeaser,
  StyledUserName,
  TimeSignature
} from './UsersPaneStyles'
import { useWhenPropSustained } from '../../components/common/hooks'

// should move to the styles module
const SearchWrapper = styled.div`
  padding: 0.5rem 0.7rem;
  background-color: ${({ theme: { palette } }) =>
    palette.mode === 'dark' ? '' : palette.grey['200']};
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

const User = observer(
  ({ id, switchToChatView }: { id: string; switchToChatView?: () => void }) => {
    const store = useMst()
    const domRef = React.createRef<HTMLDivElement>()
    const selected = (store.view.id || '') === id
    const [firstRender, setFirstRender] = React.useState(true)

    // Scroll to selected user if it is not in view
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

    const [boldenName, setBoldenName] = React.useState(!!chat.unreadCount)

    // show name as normal type if it is shown consecutively for more than 1.5 seconds
    useWhenPropSustained(store.view.id, 3000, () => {
      if (store.view.id === id) setBoldenName(false)
    })

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
          <UserTeaser>
            <StyledUserName $unread={boldenName}>
              {store.users.find(user => user.id === +id)?.personName ||
                'Front Desk'}
            </StyledUserName>
            {chat.orderedMessages.length ? (
              <>
                <LastMessageContent>
                  <Typography variant="body1">{lastUserName}:</Typography>
                  <Typography variant="body2">{lastMessageContent}</Typography>
                </LastMessageContent>
                <TimeSignature>
                  {
                    chat.orderedMessages[chat.orderedMessages.length - 1]
                      .timeSignature
                  }
                </TimeSignature>
              </>
            ) : (
              <></>
            )}
          </UserTeaser>
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
          lastReadTimestamp: 0,
          lastReadTimestampShown: 0
        }
      }))
      store.addUsers(newUsers)
      store.chats.addUserChats(chats)
    }, 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
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
        <SearchWrapper>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </SearchWrapper>
        <List tabIndex={0} onKeyDown={handleKeyDown}>
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
