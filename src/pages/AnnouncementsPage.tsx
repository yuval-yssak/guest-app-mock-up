import React from 'react'
import { observer } from 'mobx-react-lite'
import Paper from '@material-ui/core/Paper'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionActions from '@material-ui/core/AccordionActions'
import AddIcon from '@material-ui/icons/Add'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import FlagIcon from '@material-ui/icons/Flag'
import styled from 'styled-components'
import PageContentWrapper from '../components/PageContentWrapper'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useMst } from '../models/reactHook'
import dayjs from 'dayjs'
import { RootStoreType } from '../models/RootStore'
import { AnnouncementInstanceType } from '../models/AnnouncementsModel'

const breakpointSplitHead = '(max-width: 45em)'

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
    justify-items: end;
  }
`

const ScrollablePageContentWrapper = styled(PageContentWrapper).attrs({
  className: 'scrollable'
})`
  word-break: break-all;

  && {
    overflow-y: scroll;
    grid-template-rows: min-content 1fr;
    align-items: start;
  }
`

const Section = styled.section.attrs(
  ({ $classPrefix }: { $classPrefix: string }) => ({
    className: `${$classPrefix}-announcements`
  })
)<{ $classPrefix: string }>`
  padding: 1rem;

  && .unread-message-heading + .MuiAccordion-root,
  && .read-message-heading + .MuiAccordion-root {
    margin-top: 0;
  }

  // give a bold font for summaries under the unread category
  ${({ $classPrefix }) =>
    $classPrefix === 'unread' &&
    `
  & .announcement-summary {
    font-weight: 500;
  }`}
`

const StyledAccordionSummary = styled(AccordionSummary)<{ $expanded: boolean }>`
  & .announcement-summary {
    ${({ $expanded }) => $expanded && `font-weight:500;`}
  }
`

const MessageTypeHeading = styled(Typography)<
  TypographyProps<'h2', { component: 'h2' }>
>`
  && {
    line-height: 1;
    font-weight: 500;
  }
`

const SectionHeading = styled.div`
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 0.5rem 1rem;
  & h2 {
    font-size: 1rem;
    line-height: 1;
  }
`

const UnreadSectionHeading = styled(SectionHeading).attrs({
  className: 'unread-message-heading',
  'aria-label': 'unread messages',
  children: (
    <MessageTypeHeading component="h2" variant="h6">
      Unread
    </MessageTypeHeading>
  )
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
`

const ReadSectionHeading = styled(SectionHeading).attrs({
  className: 'read-message-heading',
  'aria-label': 'read messages',
  children: (
    <MessageTypeHeading component="h2" variant="h6">
      Read
    </MessageTypeHeading>
  )
})`
  background-color: ${({ theme }) =>
    theme.palette.grey[theme.palette.type === 'dark' ? '500' : '300']};
`

const AnnouncementHead = styled.div.attrs({
  className: 'announcement-head'
})<{ $priority: 'high' | 'low' }>`
  display: grid;
  grid-template-columns: minmax(min-content, 1fr) max-content ${({
      $priority
    }) => $priority === 'high' && 'max-content'};
  width: 100%;
  justify-content: space-between;
  align-items: start;
  grid-gap: 0.5rem;

  @media ${breakpointSplitHead} {
    grid-template-columns: 1fr;
  }
`

const EditLine = styled.div``

const AnnouncementInfo = styled.div.attrs({ className: 'announcement-info' })`
  display: flex;
`

const Important = styled(Typography).attrs({
  className: 'important',
  'aria-label': 'important'
})`
  && {
    font-weight: 500;
    letter-spacing: 1.2px;
    margin: 0 0.4rem;
  }
`

const HighPriorityContainer = styled.div`
  display: flex;
`

function HighPriority({ withAnnotation }: { withAnnotation: boolean }) {
  return (
    <HighPriorityContainer>
      <FlagIcon color="primary" />
      {withAnnotation && <Important color="primary">Important</Important>}
    </HighPriorityContainer>
  )
}

const RespondButton = styled(Button).attrs(
  ({
    store,
    announcement
  }: {
    store: RootStoreType
    announcement: AnnouncementInstanceType
  }) => ({
    variant: 'outlined',
    size: 'small',
    onClick: () => {
      store.view.openChatPage()
      if (announcement.status === 'unread') announcement.toggle()
    },
    children: 'Respond'
  })
)<{ announcement: AnnouncementInstanceType; store: RootStoreType }>``

const ConfirmButton = styled(Button).attrs(
  ({ announcement }: { announcement: AnnouncementInstanceType }) => ({
    variant: 'outlined',
    size: 'small',
    color: 'primary',
    onClick: () => announcement.toggle(),
    children: 'Confirm as read'
  })
)<{ announcement: AnnouncementInstanceType }>`
  && {
    font-weight: 400;
  }
`

function Announcement({
  announcement,
  editMode
}: {
  announcement: AnnouncementInstanceType
  editMode: boolean
}) {
  const { id, summary, details, publishOn, status, priority } = announcement
  const [expanded, setExpanded] = React.useState(status === 'unread')
  const smallScreen = useMediaQuery('(max-width: 23.125em)')
  const mediumScreen = useMediaQuery(breakpointSplitHead)
  const store = useMst()
  return (
    <Accordion
      expanded={expanded}
      onChange={(_event, expanded) => setExpanded(expanded)}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        $expanded={expanded}
      >
        <AnnouncementHead $priority={priority}>
          <Typography className="announcement-summary">{summary}</Typography>
          {mediumScreen ? (
            <AnnouncementInfo>
              {renderInfo(priority, status, smallScreen, publishOn)}
            </AnnouncementInfo>
          ) : (
            renderInfo(priority, status, smallScreen, publishOn)
          )}
        </AnnouncementHead>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Typography>{details}</Typography>
      </StyledAccordionDetails>
      <AccordionActions>
        {!editMode && (
          <>
            <RespondButton announcement={announcement} store={store} />
            {status === 'unread' && (
              <ConfirmButton announcement={announcement} />
            )}
          </>
        )}
      </AccordionActions>
    </Accordion>
  )
}

const getAnnouncementComponent = (editMode: boolean) => (
  announcement: AnnouncementInstanceType
) => (
  <Announcement
    announcement={announcement}
    key={announcement.id}
    editMode={editMode}
  />
)

const NoAnnouncementsTitle = styled(Typography)`
  && {
    text-align: center;
    ${({ theme }) => theme.palette.type === 'dark' && `color:  #fff`};
  }
`

const EmptyPagePaper = styled(Paper)`
  margin-top: 5%;
  padding: 3rem;
`

const StyledFormControlLabel = styled(FormControlLabel)`
  && {
    display: block;
    text-align: right;
  }
`

function renderInfo(
  priority: AnnouncementInstanceType['priority'],
  status: AnnouncementInstanceType['status'],
  smallScreen: boolean,
  publishOn: AnnouncementInstanceType['publishOn']
) {
  return (
    <>
      {priority === 'high' && (
        <HighPriority withAnnotation={status === 'unread' && !smallScreen} />
      )}
      <Typography>{dayjs(publishOn).format('MMM D, YYYY')}</Typography>
    </>
  )
}

function AnnouncementsPage() {
  const store = useMst()
  const [editMode, setEditMode] = React.useState(false)

  const loggedInType = store.loggedInUser?.type
  return (
    <ScrollablePageContentWrapper>
      {loggedInType === 'staff' && (
        <StyledFormControlLabel
          label="Edit Mode"
          control={
            <Switch
              checked={editMode}
              onChange={() => setEditMode(!editMode)}
            />
          }
        />
      )}
      {editMode && (
        <EditLine>
          <IconButton>
            <AddIcon />
          </IconButton>
        </EditLine>
      )}
      {!store.announcements.all.length && (
        <Section $classPrefix="no">
          <EmptyPagePaper>
            <NoAnnouncementsTitle>
              There are no posted announcements at the moment. We'll let you
              know when something important comes up.
            </NoAnnouncementsTitle>
          </EmptyPagePaper>
        </Section>
      )}
      <Section $classPrefix="unread">
        {store.announcements.unread.length ? (
          <UnreadSectionHeading />
        ) : undefined}
        {store.announcements.unread.map(getAnnouncementComponent(editMode))}
      </Section>
      <Section $classPrefix="read">
        {store.announcements.read.length ? <ReadSectionHeading /> : undefined}
        {store.announcements.read.map(getAnnouncementComponent(editMode))}
      </Section>
    </ScrollablePageContentWrapper>
  )
}

export default observer(AnnouncementsPage)
