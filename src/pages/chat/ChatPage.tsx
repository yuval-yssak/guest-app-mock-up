import React from 'react'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import TextField from '@material-ui/core/TextField'
import SendIcon from '@material-ui/icons/Send'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useMst } from '../../models/reactHook'
import { ChatType } from '../../models/ChatModel'
import DateMessages from './DateMessages'
import { OtherMessage, SelfMessage, UnreadMessagesDivider } from './Message'
import { UsersPane } from './UsersPane'
import {
  ChatContainer,
  ChatPageContainer,
  MessagesScrollable
} from './Containers'
import { generateRandomMessages } from '../../defaultStore'
import {
  SwitchBack,
  StickyDayLabel,
  StyledIconButton,
  StyledInfiniteScroll,
  StyledLinearProgress,
  UserInputSection
} from './ChatPageStyles'

const ChatContainerPage = observer(function ChatContainerPage() {
  const store = useMst()
  const smallScreen = useMediaQuery('(max-width:40em')
  if (smallScreen && !!store.chats.withUsers) {
    return <StaffChatSinglePane />
  } else {
    return (
      <ChatPageContainer staffView={!!store.chats.withUsers}>
        {!!store.chats.withUsers && <UsersPane />}
        <ChatPage staffView={!!store.chats.withUsers} />
      </ChatPageContainer>
    )
  }
})

function StaffChatSinglePane() {
  const [visiblePane, setVisiblePane] = React.useState<'users' | 'chat'>(
    'users'
  )

  if (visiblePane === 'users') {
    return <UsersPane switchToChatView={() => setVisiblePane('chat')} />
  } else return <ChatPage selectAnotherUser={() => setVisiblePane('users')} />
}

const ChatPage = observer(function ChatPage({
  staffView = false,
  selectAnotherUser
}: {
  staffView?: boolean
  selectAnotherUser?: () => void
}) {
  const store = useMst()
  const withPerson = store.view.id
  const [userInput, setUserInput] = React.useState('')

  const dividerRef = React.createRef<HTMLDivElement>()

  const containerDomRef = React.createRef<HTMLDivElement>()
  const [containerHeight, setContainerHeight] = React.useState(0)
  const [beforeAnyScroll, setBeforeAnyScroll] = React.useState(true)

  React.useEffect(() => {
    setBeforeAnyScroll(true)
  }, [store.view.id])

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

  const userInputRef = React.createRef<HTMLDivElement>()
  function loadNext(lastTimestamp: Date) {
    return function () {
      setTimeout(() => {
        const newMessages = generateRandomMessages(
          store.users,
          +(store.view.id || '')!,
          30,
          lastTimestamp
        )
        store.chats
          .findChat(+(store.view.id || ''))
          ?.insertMessages(newMessages)
        setBeforeAnyScroll(false)
      }, 3000)
    }
  }

  // build message react components

  const chat = (
    withPerson
      ? store.chats.withUsers?.find(
          chatUser => chatUser.user.id === +withPerson
        )?.chat
      : store.chats.withSelf
  )!
  const days = arrangeChatInDays(chat)

  const messagesInDays = React.useMemo(
    () => buildMessagesJSX(days, chat, dividerRef),
    [chat, days, dividerRef]
  )

  // scroll last read message or first unread messages on any update
  React.useEffect(() => {
    if (beforeAnyScroll)
      setImmediate(() => {
        if (chat?.unreadCount) dividerRef.current?.scrollIntoView(true)
        else {
          containerDomRef.current
            ?.querySelector('.date-messages:last-of-type section:last-child')
            ?.scrollIntoView()
        }
      })
  }, [
    chat?.unreadCount,
    chat?.messages.length,
    dividerRef,
    containerDomRef,
    beforeAnyScroll
  ])

  function submitMessage() {
    if (!userInput.trim()) return

    chat?.insertSelfMessage({
      user: store.loggedInUser!.id, // loggedInUser can't be null on Chat page.
      timestamp: new Date(),
      content: userInput
    })

    // clear the text area for new input.
    setUserInput('')

    //  focus back on the text area.
    const userInputElement = userInputRef.current?.querySelector('textarea')
    if (userInputElement) {
      // focus on user input without popping up the virtual keyboard on mobile
      userInputElement.readOnly = true
      userInputElement.focus()
      userInputElement.readOnly = false
    }
  }

  if (!store.loggedInUser) return <h1>Not Logged In</h1>

  return (
    <>
      {selectAnotherUser && <SwitchBack fn={selectAnotherUser} />}
      <ChatContainer staffView={staffView}>
        <MessagesScrollable
          tabIndex={0}
          ref={containerDomRef}
          staffView={staffView}
        >
          <StyledInfiniteScroll
            dataLength={chat.orderedMessages.length}
            hasMore={true}
            loader={<StyledLinearProgress />}
            next={loadNext(chat.orderedMessages[0].timestamp)}
            height={containerHeight - 1 - 4 - 1}
            inverse
          >
            {messagesInDays}
          </StyledInfiniteScroll>
        </MessagesScrollable>
        <UserInputSection staffView={staffView}>
          <TextField
            id="user-input"
            label={
              chat === store.chats.withSelf
                ? 'Chat with us'
                : `Write to ${
                    store.users.find(user => user.id === +withPerson!)
                      ?.personName
                  }`
            }
            placeholder={
              chat === store.chats.withSelf
                ? 'Hi, I would like to'
                : `Blessed Self,`
            }
            multiline
            maxRows={5}
            margin="dense"
            variant="outlined"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            ref={userInputRef}
          />
          <StyledIconButton aria-label="send" onClick={() => submitMessage()}>
            <SendIcon />
          </StyledIconButton>
        </UserInputSection>
      </ChatContainer>
    </>
  )
})

function arrangeChatInDays(chat: ChatType) {
  return chat.orderedMessages?.reduce<
    { date: string; messages: ChatType['orderedMessages'] }[]
  >((allComponents, message) => {
    const shortDate = getUserFriendlyDate(message)
    // first iteration - return short only date and first message
    if (allComponents.length === 0)
      return [{ date: shortDate, messages: [message] }]

    // if current message's date is the same as previous message, add the message
    if (
      dayjs(message.timestamp)
        .startOf('day')
        .isSame(
          dayjs(
            allComponents[allComponents.length - 1].messages[0].timestamp
          ).startOf('day')
        )
    )
      return [
        ...allComponents.slice(0, -1),
        {
          date: shortDate,
          messages: allComponents.slice(-1)[0].messages.concat(message)
        }
      ]
    // if current message starts a new date - add the new date label
    else return allComponents.concat({ date: shortDate, messages: [message] })
  }, [])
}

function buildMessagesJSX(
  days: { date: string; messages: ChatType['orderedMessages'] }[],
  chat: ChatType,
  dividerRef: React.RefObject<HTMLDivElement>
) {
  return days.map(date => {
    const messages = date.messages.map(message => {
      const props = {
        key: message.timestamp.toString(),
        src: message.user.imageSrc,
        name: message.user.personName,
        timeSignature: message.timeSignature,
        children: <>{message.content}</>
      }

      return message.messageSide === 'other' ? (
        <OtherMessage {...props} />
      ) : (
        <SelfMessage {...props} />
      )
    })

    // add "New messages" divider
    if (chat?.unreadCount) {
      // find last read message and stick the unread divider under it.
      const lastReadMessage = date.messages.findIndex(
        message =>
          message.timestamp.getTime() === chat?.lastReadTimestamp.getTime()
      )
      if (~lastReadMessage) {
        messages.splice(
          lastReadMessage + 1,
          0,
          <UnreadMessagesDivider key="unread-divider" ref={dividerRef} />
        )
      }
    }

    return (
      <DateMessages key={date.date}>
        <StickyDayLabel day={date.date} />
        {messages}
      </DateMessages>
    )
  })
}

function getUserFriendlyDate(message: ChatType['orderedMessages'][number]) {
  return dayjs(message.timestamp).startOf('day').isSame(dayjs().startOf('day'))
    ? 'Today'
    : dayjs(message.timestamp)
        .startOf('day')
        .isSame(dayjs().subtract(1, 'days').startOf('day'))
    ? 'Yesterday'
    : dayjs(message.timestamp).startOf('week').isSame(dayjs().startOf('week'))
    ? dayjs(message.timestamp).format('dddd')
    : dayjs(message.timestamp).startOf('year').isSame(dayjs().startOf('year'))
    ? dayjs(message.timestamp).format('MMM D')
    : dayjs(message.timestamp).format('MMM D, YYYY')
}

export default ChatContainerPage
