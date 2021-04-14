import React from 'react'
import dayjs from 'dayjs'
import { observer } from 'mobx-react-lite'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import SendIcon from '@material-ui/icons/Send'
import styled from 'styled-components'
import InfiniteScroll from '../../components/common/infinite-scrolling/InfiniteScrolling'

import { useMst } from '../../models/reactHook'
import { ChatType } from '../../models/ChatModel'
import DateMessages from './DateMessages'
import { OtherMessage, SelfMessage, UnreadMessagesDivider } from './Message'
import {
  UsersPane,
  minimumChatMessageWidth,
  inBetweenChatMessageWidth,
  maximumChatMessageWidth,
  usersPaneWidth
} from './UsersPane'
import {
  ChatContainer,
  ChatPageContainer,
  MessagesScrollable
} from './Containers'
import { generateRandomMessages } from '../../defaultStore'

const StyledIconButton = styled(IconButton)`
  && {
    align-self: end;
  }
`

const UserInputSection = styled.section.attrs({
  className: 'user-input-section'
})<{ staffView: boolean }>`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 1rem;
  grid-column: 1 / -1;
  width: 100%;
  overflow: hidden; // overflows at the bottom. Wihout hiding overflow - the chat container slides under the app bar.

  margin-top: 0.5rem;
  justify-self: center;
  margin-bottom: 0.3rem;

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

  @media (max-width: 54em) {
    width: 90%;
  }

  @media (max-width: 50em) {
    grid-gap: 0;
    margin-left: 0.6rem;
  }

  @media (max-width: 32.5em) {
    width: 100%;
  }
`

const DayLabelText = styled(Typography).attrs({ variant: 'h6' })`
  && {
    font-size: 0.85rem;
  }
`

const StickyDayLabel = styled.div.attrs(({ day }: { day: string }) => ({
  className: 'day-label',
  children: <DayLabelText>{day}</DayLabelText>
}))<{ day: string }>`
  justify-self: center;
  padding: 0.1rem;
  border-radius: 1.1rem;
  background-color: #eee;
  color: #555;
  grid-column: 1 / -1;
  position: sticky;
  top: 0.4rem;
  width: 7.3rem;
  text-align: center;
  z-index: 2;
`

const StyledInfiniteScroll = styled(InfiniteScroll)`
  display: grid;
  grid-row-gap: 2rem;

  &:focus {
    outline: none;
  }
`

const StyledLinearProgress = styled(LinearProgress)`
  && {
    flex: 1 0 4px;
    margin-bottom: 0;
    margin-top: 0.18rem;
  }
`

function ChatPage({ withPerson }: { withPerson?: string }) {
  const store = useMst()
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
      }, 1000)
    }
  }

  // build message react components

  const chat = (withPerson
    ? store.chats.withUsers?.find(chatUser => chatUser.user.id === +withPerson)
        ?.chat
    : store.chats.withSelf)!
  const days = arrangeChatInDays(chat)

  const messagesInDays = buildMessagesJSX(days, chat, dividerRef)

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
    <ChatPageContainer staffView={!!store.chats.withUsers}>
      {store.chats.withUsers && <UsersPane />}
      <ChatContainer staffView={!!store.chats.withUsers}>
        <MessagesScrollable
          tabIndex={0}
          ref={containerDomRef}
          staffView={!!store.chats.withUsers}
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
        <UserInputSection staffView={!!store.chats.withUsers}>
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
            rowsMax={5}
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
    </ChatPageContainer>
  )
}

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

export default observer(ChatPage)
