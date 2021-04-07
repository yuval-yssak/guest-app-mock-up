/**
 * In this module we define styling and rendering only (dumb components)
 *
 * The terms "other" and "self" are used to denote the side of the message
 * Namely - "self" messages align to the right, and "other" messages to the left
 *
 * The exported components are:
 * 1. SelfMessage
 * 2. OtherMessage
 * 3. UnreadMessagesDivider (This is the "New" keyword for unread messages)
 */

import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import styled from 'styled-components'

// below this breakpoint the avatar enters the message frame
const breakpointFullLine = '(max-width: 37.5em)'

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

  // both other and self messages take all columns below this breakpoint
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

// other messages take the left 7/8ths portion of the view
// they show the avatar to the left of the message frame
const OtherMessageContainer = styled(MessageContainer).attrs({
  className: 'other-message-section'
})`
  justify-self: start;
  grid-column: 1 / 16;
  grid-template-columns: min-content 1fr;
`

// self messages take the right 7/8ths portion of the view
// they show the avatar to the right of the message frame
const SelfMessageContainer = styled(MessageContainer).attrs({
  className: 'self-message-section'
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

const SelfMessageFrame = styled(MessageFrame).attrs({
  className: 'self-message-frame'
})`
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
`

const OtherMessageFrame = styled(MessageFrame).attrs({
  className: 'other-message-frame'
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

const StyledSelfAvatar = styled(StyledAvatar).attrs({
  className: 'self-avatar'
})`
  @media ${breakpointFullLine} {
    margin-top: unset;
    // take the entire right column within the message frame
    grid-area: 1 / 2 / 3 / -1;
  }
`

const StyledOtherAvatar = styled(StyledAvatar).attrs({
  className: 'other-avatar'
})`
  @media ${breakpointFullLine} {
    // take the entire left column within the message frae
    grid-area: 1 / 1 / 3 / 2;
  }
`

const SelfAvatar = ({ src, name }: { src: string; name: string }) => {
  if (src) return <StyledSelfAvatar alt="user avatar" src={src} />
  else
    return (
      <StyledSelfAvatar alt="user avatar">
        {getNameInitials(name)}
      </StyledSelfAvatar>
    )
}

const OtherAvatar = ({ src, name }: { src: string; name: string }) => {
  if (src) return <StyledOtherAvatar alt={`${name} photo`} src={src} />
  else
    return (
      <StyledOtherAvatar alt={`${name} photo`}>
        {getNameInitials(name)}
      </StyledOtherAvatar>
    )
}

function getNameInitials(name: string) {
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

const SelfMessageHead = styled(MessageHead)`
  @media ${breakpointFullLine} {
    // the message frame includes the avatar inside it.
    // It is placed on the right, taking min-content.
    grid-template-columns: minmax(min-content, max-content) min-content;
  }
`

const OtherMessageHead = styled(MessageHead)`
  @media ${breakpointFullLine} {
    // the message frame includes the avatar inside it.
    // It is placed on the left, taking min-content.
    grid-template-columns: min-content minmax(min-content, max-content);
    justify-content: start;
  }
`

export const SelfMessage = ({
  children,
  name,
  src,
  timeSignature
}: {
  children: React.ReactNode
  name: string
  src: string
  timeSignature: string
}) => {
  const avatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  return (
    <SelfMessageContainer>
      {avatarInFrame ? (
        <>
          <SelfMessageFrame>
            <SelfMessageHead>
              <SelfAvatar src={src} name={name} />
              <Typography className="message-name"></Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </SelfMessageHead>
            {children}
          </SelfMessageFrame>
        </>
      ) : (
        <>
          <SelfMessageFrame>
            <SelfMessageHead>
              <Typography className="message-name"></Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </SelfMessageHead>
            {children}
          </SelfMessageFrame>
          <SelfAvatar src={src} name={name} />
        </>
      )}
    </SelfMessageContainer>
  )
}

export const OtherMessage = ({
  children,
  name,
  src,
  timeSignature
}: {
  children: React.ReactNode
  name: string
  src: string
  timeSignature: string
}) => {
  const showAvatarInFrame = useMediaQuery(`${breakpointFullLine}`)

  return (
    <OtherMessageContainer>
      {showAvatarInFrame ? (
        <>
          <OtherMessageFrame>
            <OtherMessageHead>
              <OtherAvatar name={name} src={src} />
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </OtherMessageHead>
            {children}
          </OtherMessageFrame>
        </>
      ) : (
        <>
          <OtherAvatar name={name} src={src} />
          <OtherMessageFrame>
            <SelfMessageHead>
              <Typography className="message-name">{name}</Typography>
              <Typography className="message-time" variant="body2">
                {timeSignature}
              </Typography>
            </SelfMessageHead>
            {children}
          </OtherMessageFrame>
        </>
      )}
    </OtherMessageContainer>
  )
}

export const UnreadMessagesDivider = styled.div.attrs({
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
