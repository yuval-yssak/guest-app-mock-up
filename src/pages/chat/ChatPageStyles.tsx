import * as React from 'react'
import styled from 'styled-components'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import InfiniteScroll from '../../components/common/infinite-scrolling/InfiniteScrolling'
import {
  minimumChatMessageWidth,
  inBetweenChatMessageWidth,
  maximumChatMessageWidth,
  usersPaneWidth
} from './UsersPaneStyles'

export const StyledIconButton = styled(IconButton)`
  && {
    align-self: end;
  }
`

const BackButton = styled(IconButton)`
  && {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: #eee;
    z-index: 10;
  }
`

export function SwitchBack({ fn }: { fn: () => void }) {
  return (
    <BackButton onClick={fn}>
      <ArrowBackIcon />
    </BackButton>
  )
}

export const UserInputSection = styled.section.attrs({
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

export const StickyDayLabel = styled.div.attrs(({ day }: { day: string }) => ({
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
  top: 0.5rem;
  width: 7.3rem;
  text-align: center;
  z-index: 2;
`

export const StyledInfiniteScroll = styled(InfiniteScroll)`
  display: grid;
  grid-row-gap: 2rem;

  &:focus {
    outline: none;
  }
`

export const StyledLinearProgress = styled(LinearProgress)`
  && {
    flex: 1 0 4px;
    margin-bottom: 0;
    margin-top: 0.18rem;
  }
`
