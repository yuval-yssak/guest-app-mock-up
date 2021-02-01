import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import styled from 'styled-components'
import PageMainPaper, { mainGridGap } from '../components/PageMainPaper'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import RootRef from '@material-ui/core/RootRef'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const breakpointScenarioSideDisplay = '(max-width: 87em)'

// below this breakpoint the avatar enters the message frame
const breakpointFullLine = '(max-width: 26.25em)'

const guestPhoto = './images/fake-avatar.jpg'
const staff1Photo = './images/pranava-chaitanya.jpg'
const staff2Photo = './images/iswara-chaitanya.jpg'

const ChatDemoLayout = styled.div.attrs({
  className: 'chat-demo-layout'
})`
  && {
    display: grid;
    grid-template-columns: 1fr minmax(60rem, 80%) 1fr;
    height: calc(100% - 4rem);
    width: 100%;
    justify-content: center;
    overflow-y: scroll;
    height: 100%;
    align-self: start;

    @media ${breakpointScenarioSideDisplay} {
      grid-template-columns: 80%;
      grid-template-rows: min-content 1fr;

      & > aside {
        grid-auto-flow: column;
        max-width: unset;
        grid-gap: 1rem;
        height: 3rem;
      }
    }
    @media (max-width: 34.5em) {
      grid-template-columns: 100%;
    }
  }
`

const Aside = styled.aside`
  padding: 0 1rem;
  max-width: 15rem;
  display: grid;
  align-content: start;
  grid-gap: 0.5rem;
  overflow-y: scroll;
`

const SideTitle = styled(Typography).attrs({
  className: 'title',
  variant: 'h4'
})`
  && {
    margin-bottom: 1rem;
  }
`

const StyledIconButton = styled(IconButton)`
  && {
    align-self: end;
  }
`

const ChatContainer = styled.div.attrs({ className: 'chat' })`
  display: grid;
  grid-template-rows: 1fr max-content;
  overflow: hidden;

  * p {
    // prevent very long words or URLs from breaking the design
    overflow-wrap: anywhere;
  }
`

const MessagesScrollable = styled(PageMainPaper).attrs({
  className: 'messages-scrollable'
})`
  && {
    grid-template-columns: repeat(8, 1fr);
    align-items: end;
    overflow: scroll;
    max-width: unset;

    @media (max-width: 50em) {
      padding: 1rem 1.5rem;
    }

    @media (max-width: 20em) {
      padding: 0;
    }

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

  @media (max-width: 44em) {
    grid-gap: 0;
  }
`

const MessageContainer = styled.section`
  display: grid;
  align-items: start;
  grid-gap: 0.5rem;

  @media ${breakpointFullLine} {
    && {
      grid-column: 1 / -1;
      grid-template-columns: minmax(min-content, max-content);
    }
  }

  & .MuiAvatar-root:hover {
    // todo: put this seleeector in its rightfulplace
    transform: scale(2);
  }

  &:hover {
    & .message-head > p {
      opacity: 1;
      transform: translateX(2px);
    }
  }
`

const StaffMessageContainer = styled(MessageContainer).attrs({
  className: 'staff-message'
})`
  justify-self: start;
  grid-column: 1 / 8;
  grid-template-columns: min-content 1fr;
`

const GuestMessageContainer = styled(MessageContainer).attrs({
  className: 'guest-message'
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
  background-color: ${({ theme }) =>
    theme.palette.type === 'dark'
      ? theme.palette.grey['700']
      : theme.palette.grey['50']};
  color: ${({ theme }) =>
    theme.palette.type === 'dark'
      ? '#fff'
      : theme.palette.primary.contrastText};
`

const GuestAvatar = styled(Avatar)`
  margin-top: 0.45rem;
  transition: all 0.2s;

  @media ${breakpointFullLine} {
    margin-top: unset;
    grid-area: 1 / 2 / 3 / -1; // take the entire left column
  }
`

const StaffAvatar = styled(GuestAvatar)`
  @media ${breakpointFullLine} {
    grid-area: 1 / 1 / 3 / 2; // take the entire right column
  }
`

// top row of the message frame. Includes sender name and message date
const GuestMessageHead = styled.div.attrs({ className: 'message-head' })`
  display: grid;
  align-items: start;
  // display name along side time, time does not break into lines
  grid-template-columns: 1fr max-content;
  grid-column-gap: 1rem;
  justify-content: space-between;
  margin-bottom: 0.3rem;

  @media (max-width: 51.4em) {
    // adjust sender's name and message dates in separate rows
    grid-template-columns: minmax(min-content, max-content);
  }

  @media ${breakpointFullLine} {
    // the message frame includes the avatar inside it.
    // It is placed on the right, taking min-content.
    grid-template-columns: minmax(min-content, max-content) min-content;
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

const StaffMessageHead = styled(GuestMessageHead)`
  @media ${breakpointFullLine} {
    // the message frame includes the avatar inside it.
    // It is placed on the left, taking min-content.
    grid-template-columns: min-content minmax(min-content, max-content);
    justify-content: start;
  }
`

function GuestMessage({ children, className, name, src, time }) {
  const avatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  // update component every minute
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  setInterval(forceUpdate, 6e3)

  return (
    <GuestMessageContainer>
      {avatarInFrame ? (
        <>
          <GuestMessageFrame className={className}>
            <GuestMessageHead>
              <Typography className="message-name"></Typography>
              <GuestAvatar
                className="guest-avatar"
                alt="user avatar"
                {...(src
                  ? { src }
                  : {
                      children: name
                        .split(/\s/)
                        .map(word => word[0])
                        .join('')
                    })}
              />
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
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
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </GuestMessageHead>
            {children}
          </GuestMessageFrame>
          <GuestAvatar
            className="guest-avatar"
            alt="user avatar"
            {...(src
              ? { src }
              : {
                  children: name
                    .split(/\s/)
                    .map(word => word[0])
                    .join('')
                })}
          />
        </>
      )}
    </GuestMessageContainer>
  )
}

function StaffMessage({ children, className, name, src, time }) {
  const avatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  // update component every minute
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  setInterval(forceUpdate, 6e3)

  return (
    <StaffMessageContainer>
      {avatarInFrame ? (
        <>
          <StaffMessageFrame className={className}>
            <StaffMessageHead>
              <Typography className="message-name">{name}</Typography>
              <StaffAvatar
                className="staff-avatar"
                alt={`${name} photo`}
                {...(src
                  ? { src }
                  : {
                      children: name
                        .split(/\s/)
                        .map(word => word[0])
                        .join('')
                    })}
              />
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </StaffMessageHead>
            {children}
          </StaffMessageFrame>
        </>
      ) : (
        <>
          <StaffAvatar
            className="guest-avatar"
            alt={`${name} photo`}
            {...(src
              ? { src }
              : {
                  children: name
                    .split(/\s/)
                    .map(word => word[0])
                    .join('')
                })}
          />
          <StaffMessageFrame className={className}>
            <GuestMessageHead>
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </GuestMessageHead>
            {children}
          </StaffMessageFrame>
        </>
      )}
    </StaffMessageContainer>
  )
}
const NewBelow = styled.div.attrs({
  className: 'unread-messages-divider',
  children: <Typography variant="subtitle2">New</Typography>
})`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column: 1 / 8;
  position: relative;
  align-items: center;
  grid-gap: 0.5rem;

  color: ${({ theme }) => theme.palette.warning.main};
  margin-bottom: calc(0.3rem - ${mainGridGap});
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

export default function ChatPage() {
  const [scenario, setScenario] = React.useState('none')
  const shrinkScenarios = useMediaQuery(`${breakpointScenarioSideDisplay}`)
  const [showScenarios, setShowScenarios] = React.useState(false)

  const scenarios = [
    { name: 'none', label: 'None' },
    { name: 'empty', label: 'Empty' },
    {
      name: 'staff initiated 1 message, unread',
      label: 'Staff initiated first unread message'
    },
    {
      name: 'staff initiated 1 message, read',
      label: 'Staff initiated first read message'
    },
    {
      name: 'guest initiated 1 message',
      label: 'Guest initiated first message'
    },
    {
      name: 'guest and staff talking 10 messages over 2 days',
      label: 'Communication back & forth 10 msg. over 2 days'
    },
    {
      name: 'guest and staff talking 60 messages',
      label: 'Communication back & forth 60 messages'
    }
  ]
  function setScenarioAndCloseMenu(newScenario) {
    setShowScenarios(false)
    setScenario(newScenario)
  }
  const buttonRef = React.useRef()

  return (
    <ChatDemoLayout>
      <Aside>
        {shrinkScenarios ? (
          <>
            <RootRef rootRef={buttonRef}>
              <Button
                style={{ justifySelf: 'start', fontWeight: 700 }}
                variant="contained"
                size="large"
                onClick={() => setShowScenarios(true)}
              >
                Scenarios
              </Button>
            </RootRef>
            <Menu
              id="simple-menu"
              keepMounted
              open={showScenarios}
              anchorEl={buttonRef.current}
            >
              {scenarios.map(s => (
                <MenuItem
                  selected={scenario === s.name}
                  onClick={() => setScenarioAndCloseMenu(s.name)}
                  key={s.name}
                >
                  {s.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <>
            <SideTitle variant="h4">Scenarios</SideTitle>
            {scenarios.map(s => (
              <Button
                color={scenario === s.name ? 'primary' : 'default'}
                variant="contained"
                onClick={() => setScenario(s.name)}
                key={s.name}
              >
                {s.label}
              </Button>
            ))}
          </>
        )}
      </Aside>
      {scenario === 'none' && <ChatContainer></ChatContainer>}
      {scenario === 'empty' && <Chat />}
      {scenario === 'staff initiated 1 message, unread' && (
        <Chat newSince={1}>
          <StaffMessage
            src={staff1Photo}
            name="Pranava Chaitanya"
            time={dayjs().subtract(9, 'minutes')}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Distinctio, aspernatur vitae dignissimos, unde beatae, non possimus
            doloremque quod animi earum sint sit doloribus sed iste facilis in
            libero accusamus perspiciatis.
          </StaffMessage>
        </Chat>
      )}
      {scenario === 'staff initiated 1 message, read' && (
        <Chat>
          <StaffMessage
            src={staff2Photo}
            name="Iswara Chaitanya"
            time={dayjs().subtract(3, 'days')}
          >
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Distinctio, aspernatur vitae dignissimos, unde beatae, non possimus
            doloremque quod animi earum sint sit doloribus sed iste facilis in
            libero accusamus perspiciatis.
          </StaffMessage>
        </Chat>
      )}
      {scenario === 'guest initiated 1 message' && (
        <Chat>
          <GuestMessage
            src={guestPhoto}
            name="Adriel Steuber"
            time={dayjs()
              .subtract(1, 'days')
              .add(5, 'hours')
              .minute(31)
              .second(4)}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi velit,
            aliquam minima numquam alias officiis accusamus aut? Sequi atque
            nihil blanditiis voluptatem rerum deserunt quo, alias itaque tempora
            similique placeat!
          </GuestMessage>
        </Chat>
      )}
      {scenario === 'guest and staff talking 10 messages over 2 days' && (
        <Chat newSince={2}>
          <StaffMessage
            src={staff1Photo}
            name="Pranava Chaitanya"
            time={dayjs().subtract(10, 'hours').minute(5).second(30)}
          >
            Lorem ipsum dolor sit
          </StaffMessage>
          <GuestMessage
            src={guestPhoto}
            name="Adriel Steuber"
            time={dayjs().subtract(10, 'hours').minute(11).second(42)}
          >
            Proin interdum mi non mi consequat, nec commodo odio tempor. Donec
            aliquet pharetra sem non convallis. Morbi lobortis odio eget
            tristique scelerisque. Quisque pretium nec lorem eu sagittis. Nullam
            tincidunt nibh at tortor efficitur, at viverra est rutrum. Nulla
            interdum eros ac odio rutrum, sit amet eleifend augue ornare.
            Praesent sed consequat felis. Suspendisse aliquam fermentum nulla id
            maximus. Sed viverra cursus dolor eget rhoncus. Sed metus dolor,
            mollis in ligula vel, cursus lobortis massa. Aliquam vehicula eros
            at commodo dignissim. Sed imperdiet massa magna, et tristique odio
            lacinia eu. Curabitur tempor, leo id congue finibus, ligula orci
            sagittis leo, id laoreet dui neque nec arcu.
          </GuestMessage>
          <StaffMessage
            src={staff1Photo}
            name="Pranava Chaitanya"
            time={dayjs().subtract(2, 'hours').add(45, 'minutes')}
          >
            Vivamus vel metus tellus. Vivamus ut placerat nunc. Donec in quam.
          </StaffMessage>
          <StaffMessage
            src={staff2Photo}
            name="Iswara Chaitanya"
            time={dayjs().subtract(2, 'hours').add(46, 'minutes')}
          >
            Sed lobortis nisi
          </StaffMessage>
          <GuestMessage
            src={guestPhoto}
            name="Adriel Steuber"
            time={dayjs().subtract(1, 'hour').add(5, 'minutes').minute(39)}
          >
            Sed nec nunc sapien. Sed vel vulputate erat.
          </GuestMessage>
          <StaffMessage
            src={staff1Photo}
            name="Pranava Chaitanya"
            time={dayjs().subtract(20, 'minutes')}
          >
            Vestibulum tincidunt elit nulla, vitae sollicitudin risus lacinia
            commodo. Fusce pulvinar vel nunc non ornare. Duis vulputate placerat
            iaculis. Donec facilisis, arcu in fringilla congue, sapien risus
            viverra nibh, eget porta justo libero non est. Proin nec ex semper,
            sagittis nunc fringilla, accumsan diam. Nunc blandit arcu at
            efficitur lobortis. Cras et lacinia arcu, at fermentum libero. Etiam
            convallis quis ligula vel varius. Praesent eu nulla lacinia, egestas
            sapien eget, porta nunc. Cras condimentum mauris ac erat
            ullamcorper, sit amet tempor ex semper. Quisque ullamcorper blandit
            magna, ac rhoncus libero cursus dapibus. Aenean aliquet nulla
            laoreet, rutrum risus sed, fermentum augue. Quisque congue diam eget
            arcu ullamcorper, in tristique nisi lobortis. Vivamus ullamcorper
            enim sit amet interdum dictum. Phasellus lobortis orci ac velit
            accumsan commodo.
          </StaffMessage>
          <StaffMessage
            src={staff1Photo}
            name="Pranava Chaitanya"
            time={dayjs().subtract(10, 'minutes')}
          >
            Nullam in nisi in eros convallis eleifend et posuere orci. Duis non
            tincidunt diam, non pretium diam. Vivamus ante velit, pharetra
            congue dignissim in, iaculis eu nisi. Duis sed dictum risus, ut
            laoreet risus. Proin ut nisi dui. Aenean nec volutpat ex. Nullam
            arcu libero, sollicitudin et tincidunt nec, porttitor interdum ex.
            Aenean sagittis lobortis vestibulum. Phasellus dignissim ultricies
            felis.
          </StaffMessage>
          <StaffMessage
            src={staff2Photo}
            name="Iswara Chaitanya"
            time={dayjs().subtract(2, 'minutes')}
          >
            Morbi faucibus, orci facilisis ullamcorper tincidunt, odio ipsum
            pulvinar quam, a euismod velit purus sit amet mi. Sed venenatis
            nibh.
          </StaffMessage>
          <StaffMessage name="Bhargavi" time={dayjs().subtract(1, 'minutes')}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit,
            magnam.
          </StaffMessage>
        </Chat>
      )}
    </ChatDemoLayout>
  )
}

function Chat({ children, newSince }) {
  const [userInput, setUserInput] = React.useState('')
  const dividerRef = React.useRef()
  const messagesParentRef = React.useRef()
  const userInputRef = React.createRef()
  const [statefulMessages, setStatefulMessages] = React.useState()

  // manage local state
  React.useEffect(() => {
    const displayMessages = React.Children.toArray(children)

    if (newSince)
      displayMessages.splice(
        newSince * -1,
        0,
        <NewBelow key="unread-divider" ref={dividerRef} />
      )

    setStatefulMessages(displayMessages)
  }, [newSince, children])

  // show last read message or first unread messages
  React.useEffect(() => {
    if (newSince) dividerRef.current?.scrollIntoView()
    else
      messagesParentRef.current
        ?.querySelector('section:last-child')
        ?.scrollIntoView()
  }, [statefulMessages, newSince])

  // once user input is changed, focus back on the text area.
  React.useEffect(() => {
    userInputRef.current.querySelector('textarea')?.focus()
  }, [userInput, userInputRef])

  function submitMessage() {
    // insert the user input as a guest message
    setStatefulMessages(
      statefulMessages.concat(
        <GuestMessage src={guestPhoto} name="Adriel Steuber" time={dayjs()}>
          {userInput}
        </GuestMessage>
      )
    )

    // clear the text area for new input.
    setUserInput('')
  }

  return (
    <ChatContainer>
      <MessagesScrollable elevation={0} ref={messagesParentRef}>
        {statefulMessages}
      </MessagesScrollable>
      <UserInputSection>
        <TextField
          id="user-input"
          label="Chat with us"
          placeholder="Hi, I would like to"
          multiline
          margin="dense"
          variant="outlined"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          ref={userInputRef}
        />
        <StyledIconButton onClick={submitMessage}>
          <SendIcon />
        </StyledIconButton>
      </UserInputSection>
    </ChatContainer>
  )
}
