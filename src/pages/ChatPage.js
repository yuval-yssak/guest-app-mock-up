import React from 'react'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import styled from 'styled-components'
import PageMainPaper, { mainGridGap } from '../components/PageMainPaper'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import RootRef from '@material-ui/core/RootRef'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const ChatDemoLayout = styled.div.attrs({
  className: 'chat-demo-layout'
})`
  && {
    display: grid;
    grid-template-columns: 1fr minmax(60%, 60rem) 1fr;
    height: calc(100% - 4rem);
    width: 100%;
    justify-content: center;

    @media (max-width: 71.5em) {
      grid-template-columns: 80%;
      grid-template-rows: min-content 1fr;

      & > aside {
        grid-auto-flow: column;
        max-width: unset;
        margin-top: -2rem;
        grid-gap: 1rem;
        height: 3rem;
        overflow-y: scroll;
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
`

const SideTitle = styled(Typography).attrs({
  className: 'title',
  variant: 'h4'
})`
  && {
    margin-bottom: 1rem;
  }
`

const Chat = styled(PageMainPaper).attrs({ className: 'chat' })`
  && {
    height: 100%;
    max-width: unset;
    grid-template-rows: max-content 1fr;
    align-items: end;
  }
`

const UserInputSection = styled.section.attrs({
  className: 'user-input-section'
})`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-gap: 1rem;

  @media (max-width: 44em) {
    grid-gap: 0;
  }
`

const StaffMessage = styled.section.attrs({ className: 'staff-message' })`
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`

const GuestMessage = styled.section.attrs({ className: 'guest-message' })`
  && {
    padding: 1rem;
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
    border: 1px solid #ddd;
    border-radius: 0.5rem;
  }
`

const NewBelow = styled.div.attrs({
  children: <Typography variant="subtitle2">New</Typography>
})`
  display: grid;
  grid-template-columns: max-content 1fr;
  position: relative;
  align-items: center;
  grid-gap: 0.5rem;
  color: ${({ theme }) =>
    theme.palette.type === 'dark'
      ? theme.palette.error.light
      : theme.palette.error.dark};
  margin-bottom: calc(0.3rem - ${mainGridGap});
  margin-left: 0.5rem;

  &:after {
    content: '';
    height: 1px;
    background-color: currentColor;
    width: calc(100% - 0.5rem);
  }
`

export default function ChatPage(props) {
  /** possible scenarios:
   * none
   * empty
   * staff initiated 1 message, unread
   * staff initiated 1 message, read
   * guest initiated 1 message
   * guest and staff talking 10 messages over 2 days
   * guest and staff talking 60 messages
   */
  const [scenario, setScenario] = React.useState('none')
  const shrinkScenarios = useMediaQuery('(max-width: 71.5em)')
  const [showScenarios, setShowScenarios] = React.useState(false)
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
              <MenuItem
                selected={scenario === 'none'}
                onClick={() => setScenarioAndCloseMenu('none')}
              >
                None (for mock-up purposes)
              </MenuItem>
              <MenuItem
                selected={scenario === 'empty'}
                onClick={() => setScenarioAndCloseMenu('empty')}
              >
                Empty chat
              </MenuItem>
              <MenuItem
                selected={scenario === 'staff initiated 1 message, unread'}
                onClick={() =>
                  setScenarioAndCloseMenu('staff initiated 1 message, unread')
                }
              >
                Staff initiated first unread message
              </MenuItem>
              <MenuItem
                selected={scenario === 'staff initiated 1 message, read'}
                onClick={() =>
                  setScenarioAndCloseMenu('staff initiated 1 message, read')
                }
              >
                Staff initiated first read message
              </MenuItem>
              <MenuItem
                selected={scenario === 'guest initiated 1 message'}
                onClick={() =>
                  setScenarioAndCloseMenu('guest initiated 1 message')
                }
              >
                Guest initiated first message
              </MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <SideTitle variant="h4">Scenarios</SideTitle>
            <Button variant="outlined" onClick={() => setScenario('none')}>
              None (for mock-up purposes)
            </Button>
            <Button
              color={scenario === 'empty' ? 'primary' : 'default'}
              variant="contained"
              onClick={() => setScenario('empty')}
            >
              Empty chat
            </Button>
            <Button
              color={
                scenario === 'staff initiated 1 message, unread'
                  ? 'primary'
                  : 'default'
              }
              variant="contained"
              onClick={() => setScenario('staff initiated 1 message, unread')}
            >
              Staff initiated first unread message
            </Button>
            <Button
              color={
                scenario === 'staff initiated 1 message, read'
                  ? 'primary'
                  : 'default'
              }
              variant="contained"
              onClick={() => setScenario('staff initiated 1 message, read')}
            >
              Staff initiated first read message
            </Button>
            <Button
              color={
                scenario === 'guest initiated 1 message' ? 'primary' : 'default'
              }
              variant="contained"
              onClick={() => setScenario('guest initiated 1 message')}
            >
              Guest initiated first message
            </Button>
          </>
        )}
      </Aside>
      {scenario === 'none' && <Chat></Chat>}
      {scenario === 'empty' && (
        <Chat>
          <UserInputSection>
            <TextField
              id="user-input"
              label="Chat with us"
              placeholder="Hi, I would like to"
              multiline
              variant="outlined"
            />
            <IconButton>
              <SendIcon />
            </IconButton>
          </UserInputSection>
        </Chat>
      )}
      {scenario === 'staff initiated 1 message, unread' && (
        <Chat>
          <NewBelow />
          <StaffMessage>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Distinctio, aspernatur vitae dignissimos, unde beatae, non possimus
            doloremque quod animi earum sint sit doloribus sed iste facilis in
            libero accusamus perspiciatis.
          </StaffMessage>
          <UserInputSection>
            <TextField
              id="user-input"
              label="Chat with us"
              placeholder="Hi, I would like to"
              multiline
              variant="outlined"
            />
            <IconButton>
              <SendIcon />
            </IconButton>
          </UserInputSection>
        </Chat>
      )}
      {scenario === 'staff initiated 1 message, read' && (
        <Chat>
          <StaffMessage>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Distinctio, aspernatur vitae dignissimos, unde beatae, non possimus
            doloremque quod animi earum sint sit doloribus sed iste facilis in
            libero accusamus perspiciatis.
          </StaffMessage>
          <UserInputSection>
            <TextField
              id="user-input"
              label="Chat with us"
              placeholder="Hi, I would like to"
              multiline
              variant="outlined"
            />
            <IconButton>
              <SendIcon />
            </IconButton>
          </UserInputSection>
        </Chat>
      )}
      {scenario === 'guest initiated 1 message' && (
        <Chat>
          <GuestMessage>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi velit,
            aliquam minima numquam alias officiis accusamus aut? Sequi atque
            nihil blanditiis voluptatem rerum deserunt quo, alias itaque tempora
            similique placeat!
          </GuestMessage>
          <UserInputSection>
            <TextField
              id="user-input"
              label="Chat with us"
              placeholder="Hi, I would like to"
              multiline
              variant="outlined"
            />
            <IconButton>
              <SendIcon />
            </IconButton>
          </UserInputSection>
        </Chat>
      )}
    </ChatDemoLayout>
  )
}
