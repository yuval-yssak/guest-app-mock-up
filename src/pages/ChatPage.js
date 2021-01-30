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

    @media ${breakpointScenarioSideDisplay} {
      grid-template-columns: 80%;
      grid-template-rows: min-content 1fr;
      overflow-y: unset;

      & > aside {
        grid-auto-flow: column;
        max-width: unset;
        margin-top: -2rem;
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
    margin-bottom: 0.3125rem;
  }
`

const ChatContainer = styled(PageMainPaper).attrs({ className: 'chat' })`
  && {
    height: 100%;
    max-width: unset;
    grid-template-rows: 1fr;
    align-items: end;
    grid-template-columns: repeat(8, 1fr);
    overflow: scroll;

    @media (max-width: 50em) {
      padding: 1rem 1.5rem;
    }

    @media (max-width: 20em) {
      padding: 0;
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

const StaffMessageContainer = styled.section.attrs({
  className: 'staff-message'
})`
  justify-self: start;
  grid-column: 1 / 8;
  display: grid;
  grid-template-columns: min-content 1fr;
  align-items: start;
  grid-gap: 0.5rem;

  @media ${breakpointFullLine} {
    grid-column: 1 / -1;
    grid-template-columns: minmax(min-content, max-content);
  }
`

const GuestMessageContainer = styled.section.attrs({
  className: 'guest-message'
})`
  justify-self: end;
  grid-column: 2 / 9;
  display: grid;
  grid-template-columns: 1fr min-content;
  align-items: start;
  grid-gap: 0.5rem;

  @media ${breakpointFullLine} {
    grid-column: 1 / -1;
    grid-template-columns: minmax(min-content, max-content);
  }
`

const StyledGuestMessage = styled.div.attrs({
  className: 'guest-message-frame'
})`
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  text-align: right;
`

const StyledStaffMessage = styled.div.attrs({
  className: 'staff-message-frame'
})`
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  text-align: right;
`

const GuestAvatar = styled(Avatar)`
  margin-top: 0.45rem;

  @media ${breakpointFullLine} {
    grid-area: 1 / 2 / 3 / -1;
    margin-top: unset;
  }
`

const StaffAvatar = styled(Avatar)`
  margin-top: 0.45rem;

  @media ${breakpointFullLine} {
    grid-area: 1 / 1 / 3 / 2;
    margin-top: unset;
  }
`

const GuestMessageHead = styled.div`
  display: grid;
  align-items: start;
  grid-template-columns: repeat(auto-fit, minmax(5rem, max-content));
  grid-column-gap: 1rem;
  justify-content: space-between;
  margin-bottom: 0.7rem;

  @media (max-width: 49em) {
    grid-template-columns: minmax(min-content, max-content);
  }

  @media ${breakpointFullLine} {
    grid-template-columns: minmax(min-content, max-content) min-content;
  }

  & > p {
    text-align: left;
    opacity: 0.7;
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
    grid-template-columns: min-content minmax(min-content, max-content);
    justify-content: start;
  }
`

function GuestMessage({ children, className, name, src, time }) {
  const avatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  return (
    <GuestMessageContainer>
      {avatarInFrame ? (
        <>
          <StyledGuestMessage className={className}>
            <GuestMessageHead>
              <Typography className="message-name">{name}</Typography>
              <GuestAvatar alt="user avatar" src={src} />
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </GuestMessageHead>
            {children}
          </StyledGuestMessage>
        </>
      ) : (
        <>
          <StyledGuestMessage className={className}>
            <GuestMessageHead>
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </GuestMessageHead>
            {children}
          </StyledGuestMessage>
          <GuestAvatar alt="user avatar" src={src} />
        </>
      )}
    </GuestMessageContainer>
  )
}

function StaffMessage({ children, className, name, src, time }) {
  const avatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  return (
    <StaffMessageContainer>
      {avatarInFrame ? (
        <>
          <StyledStaffMessage className={className}>
            <StaffMessageHead>
              <Typography className="message-name">{name}</Typography>
              <StaffAvatar alt={`${name} photo`} src={src} />
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </StaffMessageHead>
            {children}
          </StyledStaffMessage>
        </>
      ) : (
        <>
          <StaffAvatar alt={`${name} photo`} src={src} />
          <StyledStaffMessage className={className}>
            <GuestMessageHead>
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {`${time.format('MMM D, YYYY h:mm A')} (${dayjs().to(time)})`}
              </Typography>
            </GuestMessageHead>
            {children}
          </StyledStaffMessage>
        </>
      )}
    </StaffMessageContainer>
  )
}
const NewBelow = styled.div.attrs({
  children: <Typography variant="subtitle2">New</Typography>
})`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column: 1 / 8;
  position: relative;
  align-items: center;
  grid-gap: 0.5rem;
  color: ${({ theme }) =>
    theme.palette.type === 'dark'
      ? theme.palette.error.light
      : theme.palette.error.dark};
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
    width: calc(100% - 0.5rem);
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
        </Chat>
      )}
    </ChatDemoLayout>
  )
}

function Chat({ children, newSince }) {
  const displayMessages = React.Children.toArray(children)
  if (newSince) displayMessages.splice(newSince * -1, 0, <NewBelow />)
  return (
    <ChatContainer>
      {displayMessages}
      <UserInputSection>
        <TextField
          id="user-input"
          label="Chat with us"
          placeholder="Hi, I would like to"
          multiline
          margin="dense"
          variant="outlined"
        />
        <StyledIconButton>
          <SendIcon />
        </StyledIconButton>
      </UserInputSection>
    </ChatContainer>
  )
}
