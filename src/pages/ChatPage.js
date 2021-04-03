import React from 'react'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import styled from 'styled-components'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useMst } from '../models/reactHook'
import PageContentWrapper from '../components/PageContentWrapper'
import dayjs from 'dayjs'
import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 8,
    min: 3
  }
})

// below this breakpoint the avatar enters the message frame
const breakpointFullLine = '(max-width: 37.5em)'

const StyledIconButton = styled(IconButton)`
  && {
    align-self: end;
  }
`

const usersPaneWidth = '20rem'
const minimumChatMessageWidth = '40rem'
const inBetweenChatMessageWidth = '90vw'
const maximumChatMessageWidth = '60rem'

const ChatPageContainer = styled(PageContentWrapper).attrs({
  className: 'chat-page-container'
})`
  overflow: hidden; // scrolling is only in the inner messages container
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
  align-items: start;

  @media (max-width: 52em) {
    padding: 0 0.3rem;
  }
`

const ChatContainer = styled.div.attrs({ className: 'chat-container' })`
  display: grid;
  grid-template-rows: 1fr max-content; // keep the user input at the bottom

  // scrolling is only in the inner messages container
  overflow: hidden;
  height: 100%;

  & > * {
    ${({ staffView }) =>
      !staffView
        ? `
    padding: 0 calc(
      (
        100vw - clamp(
          ${minimumChatMessageWidth}, 
          ${inBetweenChatMessageWidth}, 
          ${maximumChatMessageWidth})
        ) / 2);
    `
        : `
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

  & > div {
    height: 4.5rem;
    background-color: ${({ theme: { palette } }) =>
      palette.type === 'dark' ? palette.grey['700'] : palette.grey['50']};
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    display: grid;
  }

  & > div:last-child {
    border-bottom: 1px solid #ddd;
  }

  & > div:hover {
    background-color: #ddd;
    font-weight: 400;
  }
`

const UsersPane = React.memo(function () {
  return (
    <UsersPaneContaner>
      {new Array(20).fill(null).map((_, i) => (
        <div key={i}>
          {lorem
            .generateWords(2)
            .split(/\s/)
            .map(n => n[0].toUpperCase() + n.slice(1))
            .join(' ')}
        </div>
      ))}
    </UsersPaneContaner>
  )
})

const messageScrollableColumnGridGap = '0.5rem'
const MessagesScrollable = styled.div.attrs({
  className: 'messages-scrollable'
})`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: grid;
  grid-row-gap: 2rem;

  &:focus {
    outline: none;
  }
`

const DateMessages = styled.div.attrs({
  className: 'date-messages'
})`
  word-break: break-word;

  display: grid;
  background-color: transparent;

  width: 100%;
  grid-template-rows: 1fr;
  grid-template-columns: repeat(20, 1fr);
  justify-content: center;
  align-items: end;
  grid-column-gap: ${messageScrollableColumnGridGap};
  grid-row-gap: 2rem;
  padding-left: 2.5rem;

  @media (max-width: 52em) {
    grid-template-columns: repeat(
      20,
      calc((90% - ${messageScrollableColumnGridGap} * 19) / 20)
    );
    padding: 0 0.3rem;
  }

  @media (max-width: 32.5em) {
    grid-template-columns: repeat(
      20,
      calc((100% - ${messageScrollableColumnGridGap} * 19) / 20)
    );
  }

  & + & {
    margin-top: 3rem;
  }
`

const UserInputSection = styled.section.attrs({
  className: 'user-input-section'
})`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 1rem;
  grid-column: 1 / -1;
  width: 100%;

  margin-top: 0.5rem;
  justify-self: center;
  margin-bottom: 0.3rem;

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

const UnreadMessagesDivider = styled.div.attrs({
  className: 'unread-messages-divider',
  children: <Typography variant="subtitle2">New</Typography>
})`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column: 1 / 16;
  position: relative;
  align-items: center;
  grid-gap: 0.5rem;
  z-index: 3;

  color: ${({ theme }) => theme.palette.warning.main};
  margin-bottom: calc(0.3rem - 2rem);
  margin-left: 0.5rem;

  @media ${breakpointFullLine} {
    grid-column: 1 / -1;
  }

  // horizontal line after the "New"
  &:after {
    content: '';
    height: 1px;
    background-color: currentColor;
    width: 100%;
  }
`

const DayLabelText = styled(Typography).attrs({ variant: 'h6' })`
  && {
    font-size: 0.85rem;
  }
`

const StickyDayLabel = styled.div.attrs(({ day }) => ({
  className: 'day-label',
  children: <DayLabelText>{day}</DayLabelText>
}))`
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

const MessageContainer = styled.section`
  display: grid;
  align-items: start;
  grid-gap: 0.5rem;
  position: relative;

  // below this breakpoint there is only one column since the avatar is
  // inside the message frame
  @media ${breakpointFullLine} {
    && {
      grid-template-columns: minmax(min-content, max-content);
    }
  }

  // both staff and guest messages take all columns below this breakpoint
  @media (max-width: 25em) {
    && {
      grid-column: 1 / -1;
    }
  }

  & .MuiAvatar-root:hover {
    // todo: put this selector in its rightfulplace
    transform: scale(1.6);
  }
`

// staff messages take the left 7/8ths portion of the view
// they show the avatar to the left of the message frame
const StaffMessageContainer = styled(MessageContainer).attrs({
  className: 'staff-message-section'
})`
  justify-self: start;
  grid-column: 1 / 16;
  grid-template-columns: min-content 1fr;
`

// guest messages take the right 7/8ths portion of the view
// they show the avatar to the right of the message frame
const GuestMessageContainer = styled(MessageContainer).attrs({
  className: 'guest-message-section'
})`
  justify-self: end;
  grid-column: 6 / 21;
  grid-template-columns: 1fr min-content;
`

const MessageFrame = styled.div`
  border: 1px solid
    ${({ theme }) => (theme.palette.type === 'dark' ? '#888' : '#ddd')};
  border-radius: 0.5rem;
  padding: 0.7rem;
  text-align: left;
`

const GuestMessageFrame = styled(MessageFrame).attrs({
  className: 'guest-message-frame'
})`
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
`

const StaffMessageFrame = styled(MessageFrame).attrs({
  className: 'staff-message-frame'
})`
  background-color: ${({ theme: { palette } }) =>
    palette.type === 'dark' ? palette.grey['700'] : palette.grey['50']};
  color: ${({ theme: { palette } }) =>
    palette.type === 'dark' ? '#fff' : palette.primary.contrastText};
`

const StyledAvatar = styled(Avatar)`
  margin-top: 0.45rem;
  transition: all 0.4s ease;
`

const StyledGuestAvatar = styled(StyledAvatar).attrs({
  className: 'guest-avatar'
})`
  @media ${breakpointFullLine} {
    margin-top: unset;
    // take the entire right column within the message frame
    grid-area: 1 / 2 / 3 / -1;
  }
`

const StyledStaffAvatar = styled(StyledAvatar).attrs({
  className: 'staff-avatar'
})`
  @media ${breakpointFullLine} {
    // take the entire left column within the message frae
    grid-area: 1 / 1 / 3 / 2;
  }
`

const GuestAvatar = ({ src, name }) => {
  if (src) return <StyledGuestAvatar alt="user avatar" src={src} />
  else
    return (
      <StyledGuestAvatar alt="user avatar">
        {getNameInitials(name)}
      </StyledGuestAvatar>
    )
}

const StaffAvatar = ({ src, name }) => {
  if (src) return <StyledStaffAvatar alt={`${name} photo`} src={src} />
  else
    return (
      <StyledStaffAvatar alt={`${name} photo`}>
        {getNameInitials(name)}
      </StyledStaffAvatar>
    )
}

function getNameInitials(name) {
  return name
    .split(/\s/)
    .map(word => word[0])
    .join('')
}

// top row of the message frame. Includes sender name and message date
const MessageHead = styled.div.attrs({ className: 'message-head' })`
  display: grid;
  align-items: start;

  // display name along side time, preserve time in one row
  grid-template-columns: 1fr max-content;
  grid-column-gap: 1rem;
  justify-content: space-between;
  margin-bottom: 0.3rem;

  @media (max-width: 51.4em) {
    // adjust sender's name and message dates in separate rows
    grid-template-columns: minmax(min-content, max-content);
  }

  & > p {
    text-align: left;
    opacity: 0.7;
    transition: all 0.08s;
  }

  & .message-name {
    justify-self: start;
  }

  & .message-time {
    line-height: 1.73;
  }
`

const GuestMessageHead = styled(MessageHead)`
  @media ${breakpointFullLine} {
    // the message frame includes the avatar inside it.
    // It is placed on the right, taking min-content.
    grid-template-columns: minmax(min-content, max-content) min-content;
  }
`

const StaffMessageHead = styled(MessageHead)`
  @media ${breakpointFullLine} {
    // the message frame includes the avatar inside it.
    // It is placed on the left, taking min-content.
    grid-template-columns: min-content minmax(min-content, max-content);
    justify-content: start;
  }
`

const GuestMessage = ({ children, className, name, src, timeSignature }) => {
  const avatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  return (
    <GuestMessageContainer>
      {avatarInFrame ? (
        <>
          <GuestMessageFrame className={className}>
            <GuestMessageHead>
              <GuestAvatar src={src} name={name} />
              <Typography className="message-name"></Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </GuestMessageHead>
            {children}
          </GuestMessageFrame>
        </>
      ) : (
        <>
          <GuestMessageFrame className={className}>
            <GuestMessageHead>
              <Typography className="message-name"></Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </GuestMessageHead>
            {children}
          </GuestMessageFrame>
          <GuestAvatar src={src} name={name} />
        </>
      )}
    </GuestMessageContainer>
  )
}

const StaffMessage = ({ children, className, name, src, timeSignature }) => {
  const showAvatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  return (
    <StaffMessageContainer>
      {showAvatarInFrame ? (
        <>
          <StaffMessageFrame className={className}>
            <StaffMessageHead>
              <StaffAvatar name={name} src={src} />
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </StaffMessageHead>
            {children}
          </StaffMessageFrame>
        </>
      ) : (
        <>
          <StaffAvatar name={name} src={src} />
          <StaffMessageFrame className={className}>
            <GuestMessageHead>
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </GuestMessageHead>
            {children}
          </StaffMessageFrame>
        </>
      )}
    </StaffMessageContainer>
  )
}

function ChatPage() {
  const store = useMst()
  const [userInput, setUserInput] = React.useState('')

  const dividerRef = React.useRef()
  const messagesParentRef = React.useRef()
  const userInputRef = React.useRef()

  // build message react components
  const messagesInDays = store.chat.orderedMessages
    .reduce((allComponents, message) => {
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

    .map(date => {
      const messages = date.messages.map(message => {
        const props = {
          key: message.timestamp,
          src: message.person.imageSrc,
          name: message.person.personName,
          timeSignature: message.timeSignature,
          children: message.content
        }

        return message.messageSide === 'staff' ? (
          <StaffMessage {...props} />
        ) : (
          <GuestMessage {...props} />
        )
      })

      // add "New messages" divider
      if (store.chat.unreadCount) {
        // find last read message and stick the unread divider under it.
        const lastReadMessage = date.messages.findIndex(
          message =>
            message.timestamp.getTime() ===
            store.chat.lastReadTimestamp.getTime()
        )
        if (~lastReadMessage) {
          messages.splice(
            lastReadMessage,
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

  // scroll last read message or first unread messages on any update
  React.useEffect(() => {
    setTimeout(() => {
      if (store.chat.unreadCount) dividerRef.current?.scrollIntoView(true)
      else {
        messagesParentRef.current
          ?.querySelector('.date-messages:last-of-type section:last-child')
          ?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)
  }, [store.chat.unreadCount, store.chat.messages.length])

  function submitMessage() {
    if (!userInput.trim()) return

    store.chat.insertGuestMessage({
      messageSide: 'guest',
      person: getSnapshot(store.loggedInUser),
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
    <ChatPageContainer staffView={!!store.chat.usersMessages}>
      {store.chat.usersMessages && <UsersPane />}
      <ChatContainer staffView={!!store.chat.usersMessages}>
        <MessagesScrollable tabIndex="0" ref={messagesParentRef}>
          {messagesInDays}
        </MessagesScrollable>
        <UserInputSection>
          <TextField
            id="user-input"
            label="Chat with us"
            placeholder="Hi, I would like to"
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

function getUserFriendlyDate(message) {
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
