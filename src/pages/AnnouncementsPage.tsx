import React from 'react'
import { observer } from 'mobx-react-lite'
import Paper from '@material-ui/core/Paper'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionActions from '@material-ui/core/AccordionActions'
import AddIcon from '@material-ui/icons/Add'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FlagIcon from '@material-ui/icons/Flag'
import styled from 'styled-components'
import PageContentWrapper from '../components/PageContentWrapper'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { useMst } from '../models/reactHook'
import dayjs from 'dayjs'
import { AnnouncementInstanceType } from '../models/AnnouncementsModel'
import TextField from '@material-ui/core/TextField'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'

const breakpointSplitHead = '(max-width: 45em)'

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
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

  && .unread-announcements-heading + .MuiAccordion-root,
  && .read-announcements-heading + .MuiAccordion-root {
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

const StyledAccordionSummary = styled(AccordionSummary)<{
  $expanded: boolean
  $keepExpanded: boolean
}>`
  & .announcement-summary {
    ${({ $expanded, $keepExpanded }) =>
      !$keepExpanded && $expanded && `font-weight:500;`}
  }
`

const AnnouncementTypeHeading = styled(Typography)<
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

const AllSectionHeading = styled(SectionHeading).attrs({
  className: 'all-announcements-heading',
  'aria-label': 'all announcements',
  children: (
    <AnnouncementTypeHeading component="h2" variant="h6">
      Announcements
    </AnnouncementTypeHeading>
  )
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
`

const UnreadSectionHeading = styled(SectionHeading).attrs({
  className: 'unread-announcements-heading',
  'aria-label': 'unread announcements',
  children: (
    <AnnouncementTypeHeading component="h2" variant="h6">
      Unread
    </AnnouncementTypeHeading>
  )
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
`

const ReadSectionHeading = styled(SectionHeading).attrs({
  className: 'read-announcements-heading',
  'aria-label': 'read announcements',
  children: (
    <AnnouncementTypeHeading component="h2" variant="h6">
      Read
    </AnnouncementTypeHeading>
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

const EditLine = styled.div.attrs({ className: 'edit-management-line' })`
  display: flex;
  column-gap: 1rem;
  padding-top: 1rem;
  align-items: center;
  /* height: 4rem; */
`

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

const ReadStats = styled(SecondaryButton).attrs({ className: 'read-stats' })`
  & .MuiButton-label {
    display: flex;
    flex-wrap: wrap;
  }

  & .MuiLinearProgress-determinate {
    border-radius: 0.25rem;
    height: 1rem;
    min-width: 6rem;
    margin-left: 1ch;
  }
`

const StatsButton = observer(function StatsButton({
  announcement
}: {
  announcement: AnnouncementInstanceType
}) {
  if (announcement.admin?.stats) {
    return (
      <ReadStats variant="outlined">
        <Typography variant="caption">Confirmations:</Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1ch'
          }}
        >
          <LinearProgress
            variant="determinate"
            value={announcement.admin.stats.readPercentage}
          />
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
          >{`${Math.round(
            announcement.admin.stats.readPercentage
          )}%`}</Typography>
        </div>
      </ReadStats>
    )
  } else {
    return (
      <ReadStats disabled>
        <Typography variant="caption">
          Confirmation Stats Unavailable
        </Typography>
      </ReadStats>
    )
  }
})

const Buttons = styled.div`
  display: flex;
`

function Announcement({
  announcement,
  keepExpanded = false,
  initialExpanded = false
}: {
  announcement: AnnouncementInstanceType
  keepExpanded?: boolean
  initialExpanded?: boolean
}) {
  const { id, subject, bodyText, publishOn, status, priority } = announcement
  const [expanded, setExpanded] = React.useState(
    initialExpanded || status === 'unread'
  )
  const smallScreen = useMediaQuery('(max-width: 23.125em)')
  const mediumScreen = useMediaQuery(breakpointSplitHead)
  const store = useMst()
  return (
    <Accordion
      expanded={keepExpanded || expanded}
      onChange={(_event, expanded) => setExpanded(expanded)}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        $expanded={expanded}
        $keepExpanded={keepExpanded}
      >
        <AnnouncementHead $priority={priority}>
          <Typography className="announcement-summary">{subject}</Typography>
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
        <Typography>{bodyText}</Typography>
      </StyledAccordionDetails>
      <AccordionActions>
        {store.announcements.editMode ? (
          <Buttons>
            <StatsButton announcement={announcement} />
            <PrimaryButton
              onClick={() => {
                console.log('announcement', announcement.id)
                store.view.openAnnouncementsEditPage(announcement.id)
              }}
            >
              Edit
            </PrimaryButton>
          </Buttons>
        ) : (
          <>
            <SecondaryButton
              onClick={() => {
                store.view.openChatPage()
                if (announcement.status === 'unread') announcement.toggle()
              }}
              children="Respond"
            />
            {status === 'unread' && (
              <PrimaryButton
                children="Confirm as read"
                onClick={() => announcement.toggle()}
              />
            )}
          </>
        )}
      </AccordionActions>
    </Accordion>
  )
}

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
  flex-grow: 1;
  justify-content: flex-end;
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

// todo: reuse code (duplicate from UsersPane.tsx)
const StyledSearchbar = styled(TextField).attrs({ type: 'search' })<{
  value: unknown // https://material-ui.com/guides/typescript/#handling-value-and-event-handlers
}>`
  // place the placeholder in the center when there is no search term.
  text-align: ${({ value }) => (value === '' ? `center` : `initial`)};
  width: 100%;

  & input {
    text-align: inherit;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  // hide the black underline when there is no search input
  & .MuiInput-underline::before {
    ${({ value }) => value === '' && `opacity: 0;`}
  }
`

const StyledToggleButton = styled(ToggleButton)`
  && {
    padding: 0.1875rem 0.5625rem;
  }
`

function AnnouncementsPage() {
  const store = useMst()
  const loggedInType = store.loggedInUser?.type
  const [view, setView] = React.useState<'active' | 'archived'>('active')
  const [searchTerm, setSearchTerm] = React.useState('')

  const viewedAnnouncements =
    view === 'active'
      ? store.announcements.active
      : store.announcements.archived

  return (
    <ScrollablePageContentWrapper>
      {loggedInType === 'staff' && (
        <EditLine>
          {!!store.announcements.editMode && (
            <>
              <IconButton
                style={{ backgroundColor: '#eee' }}
                onClick={() => store.view.openAnnouncementsNewDraftPage()}
                size="small"
              >
                <AddIcon />
              </IconButton>
              <ToggleButtonGroup
                size="small"
                value={view}
                exclusive
                onChange={() =>
                  setView(view => (view === 'active' ? 'archived' : 'active'))
                }
                aria-label="view selection"
              >
                <StyledToggleButton value="active" aria-label="active">
                  Active
                </StyledToggleButton>
                <StyledToggleButton value="archived" aria-label="archived">
                  Archived
                </StyledToggleButton>
              </ToggleButtonGroup>
            </>
          )}
          <StyledFormControlLabel
            label="Edit Mode"
            control={
              <Switch
                checked={!!store.announcements.editMode}
                onChange={() =>
                  !!store.announcements.editMode
                    ? store.announcements.exitEditMode()
                    : store.announcements.enterIntoEditMode()
                }
              />
            }
          />
        </EditLine>
      )}
      {!!store.announcements.editMode ? (
        <Section $classPrefix={view}>
          {view === 'archived' && (
            <>
              <StyledSearchbar
                placeholder="🔍"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    setSearchTerm('')
                  }
                }}
              >
                Search bar
              </StyledSearchbar>

              <IconButton>
                <MoreHorizIcon />
              </IconButton>
            </>
          )}
          {!!viewedAnnouncements.length && <AllSectionHeading />}
          {viewedAnnouncements.map(announcement => (
            <Announcement
              announcement={announcement}
              key={announcement.id}
              initialExpanded={view === 'active'}
            />
          ))}
        </Section>
      ) : (
        <>
          {!viewedAnnouncements.length && (
            <Section $classPrefix="no">
              <EmptyPagePaper>
                <NoAnnouncementsTitle>
                  There are no posted {view} announcements at the moment.
                  {view === 'active'
                    ? " We'll let you know when something important comes up."
                    : ''}
                </NoAnnouncementsTitle>
              </EmptyPagePaper>
            </Section>
          )}
          {store.announcements.unread.length ? (
            <Section $classPrefix="unread">
              <UnreadSectionHeading />
              {store.announcements.unread.map(announcement => (
                <Announcement
                  announcement={announcement}
                  key={announcement.id}
                />
              ))}
            </Section>
          ) : undefined}
          {store.announcements.read.length ? (
            <Section $classPrefix="read">
              <ReadSectionHeading />
              {store.announcements.read.map(announcement => (
                <Announcement
                  announcement={announcement}
                  key={announcement.id}
                />
              ))}
            </Section>
          ) : undefined}
        </>
      )}
    </ScrollablePageContentWrapper>
  )
}

export default observer(AnnouncementsPage)
