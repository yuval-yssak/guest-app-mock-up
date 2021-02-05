import React from 'react'
import { observer } from 'mobx-react-lite'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import styled from 'styled-components'
import PageMainPaper from '../components/PageMainPaper'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useMst } from '../models/reactHook'
import dayjs from 'dayjs'

// below this breakpoint the avatar enters the message frame
const breakpointFullLine = '(max-width: 37.5em)'

const StyledIconButton = styled(IconButton)`
  && {
    align-self: end;
  }
`

const ChatContainer = styled.div.attrs({ className: 'chat' })`
  width: min(65rem, 80%);
  display: grid;
  grid-template-rows: 1fr max-content; // keep the user input at the bottom
  grid-gap: 2rem;
  height: 100%;
  overflow: hidden; // scrolling is only in the inner messages container
  justify-items: center;

  @media (max-width: 74.5em) {
    width: 90%;
  }

  @media (max-width: 58em) {
    width: 100%;
    padding: 0 0.3rem;
  }

  * p {
    // prevent very long words or URLs from breaking the design
    overflow-wrap: anywhere;
  }
`

const MessagesScrollable = styled(PageMainPaper).attrs({
  className: 'messages-scrollable'
})`
  && {
    width: 100%;
    grid-template-columns: repeat(8, 1fr);
    align-items: end;
    overflow: scroll;
    grid-gap: 2rem;

    & > section:last-child {
      padding-bottom: 2rem;
    }
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

  @media (max-width: 50em) {
    grid-gap: 0;
    margin-left: 0.6rem;
  }
`

const UnreadMessagesDivider = styled.div.attrs({
  className: 'unread-messages-divider',
  children: <Typography variant="subtitle2">New</Typography>
})`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column: 1 / 8;
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

const StickyDayLabel = styled.div.attrs(({ day }) => ({
  className: 'day-label',
  children: <Typography variant="h6">{day}</Typography>
}))`
  justify-self: center;
  padding: 0.7rem 2rem;
  border-radius: 1.1rem;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  grid-column: 1 / -1;
  position: sticky;
  top: 0.4rem;
  width: 13rem;
  text-align: center;
  z-index: 2;

  @media screen and (max-height: 25em) {
    font-size: 1rem;
    padding: 0.2rem 2rem;
    top: -0.3rem;
  }
  @media screen and (max-height: 20em) {
    font-size: 0.8rem;
  }
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
    transform: scale(2);
  }
`

// staff messages take the left 7/8ths portion of the view
// they show the avatar to the left of the message frame
const StaffMessageContainer = styled(MessageContainer).attrs({
  className: 'staff-message-section'
})`
  justify-self: start;
  grid-column: 1 / 8;
  grid-template-columns: min-content 1fr;
`

// guest messages take the right 7/8ths portion of the view
// they show the avatar to the right of the message frame
const GuestMessageContainer = styled(MessageContainer).attrs({
  className: 'guest-message-section'
})`
  justify-self: end;
  grid-column: 2 / 9;
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
  transition: all 0.2s;
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

function getInitials(name) {
  return name
    .split(/\s/)
    .map(word => word[0])
    .join('')
}

const GuestAvatar = ({ src, name }) => {
  if (src) return <StyledGuestAvatar alt="user avatar" src={src} />
  else
    return (
      <StyledGuestAvatar alt="user avatar">
        {getInitials(name)}
      </StyledGuestAvatar>
    )
}

const StaffAvatar = ({ src, name }) => {
  if (src) return <StyledStaffAvatar alt={`${name} photo`} src={src} />
  else
    return (
      <StyledStaffAvatar alt={`${name} photo`}>
        {getInitials(name)}
      </StyledStaffAvatar>
    )
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
  const messages = store.chat.orderedMessages
    .reduce((allComponents, message) => {
      const shortDate = dayjs(message.timestamp)
        .startOf('day')
        .isSame(dayjs().startOf('day'))
        ? 'Today'
        : dayjs(message.timestamp)
            .startOf('day')
            .isSame(dayjs().subtract(1, 'days').startOf('day'))
        ? 'Yesterday'
        : dayjs(message.timestamp)
            .startOf('week')
            .isSame(dayjs().startOf('week'))
        ? dayjs(message.timestamp).format('dddd')
        : dayjs(message.timestamp)
            .startOf('year')
            .isSame(dayjs().startOf('year'))
        ? dayjs(message.timestamp).format('MMM D')
        : dayjs(message.timestamp).format('MMM D, YYYY')

      if (allComponents.length === 0)
        return [...allComponents, { shortDate }, message]

      if (
        dayjs(message.timestamp)
          .startOf('day')
          .isSame(
            dayjs(allComponents[allComponents.length - 1]?.timestamp).startOf(
              'day'
            )
          )
      )
        return [...allComponents, message]
      else return [...allComponents, { shortDate }, message]
    }, [])

    .map(message => {
      if (message.shortDate)
        return (
          <StickyDayLabel day={message.shortDate} key={message.shortDate} />
        )

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

  // add "New" messages divider
  if (store.chat.unreadCount)
    messages.splice(
      store.chat.unreadCount * -1,
      0,
      <UnreadMessagesDivider key="unread-divider" ref={dividerRef} />
    )

  // show last read message or first unread messages
  React.useEffect(() => {
    if (store.chat.unreadCount) dividerRef.current?.scrollIntoView()
    else
      messagesParentRef.current
        ?.querySelector('section:last-child')
        ?.scrollIntoView()
  }, [store.chat.unreadCount])

  // once user input is changed, focus back on the text area.
  React.useEffect(() => {
    userInputRef.current?.querySelector('textarea')?.focus()
  }, [userInput, userInputRef])

  function submitMessage() {
    // todo: insert the user input as a guest message

    // clear the text area for new input.
    setUserInput('')
  }

  if (!store.loggedInUser) return <h1>Not Logged In</h1>

  return (
    <ChatContainer>
      <MessagesScrollable tabIndex="0" elevation={0} ref={messagesParentRef}>
        {messages}
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
        <StyledIconButton aria-label="send" onClick={submitMessage}>
          <SendIcon />
        </StyledIconButton>
      </UserInputSection>
    </ChatContainer>
  )
}

export default observer(ChatPage)
