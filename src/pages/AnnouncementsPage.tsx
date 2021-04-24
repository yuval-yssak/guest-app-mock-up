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
import SaveIcon from '@material-ui/icons/Save'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined'
import LinearProgress from '@material-ui/core/LinearProgress'
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
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
import { RootStoreType } from '../models/RootStore'
import { AnnouncementInstanceType } from '../models/AnnouncementsModel'
import TextField from '@material-ui/core/TextField'

const breakpointSplitHead = '(max-width: 45em)'

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
    justify-items: end;
  }
`

const Title = styled.h2`
  font-weight: 300;
  margin-bottom: 1rem;
`

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 0.8rem;
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

const AllSectionHeading = styled(SectionHeading).attrs({
  className: 'all-announcements-heading',
  'aria-label': 'all announcements',
  children: (
    <MessageTypeHeading component="h2" variant="h6">
      All Announcements
    </MessageTypeHeading>
  )
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
`

const UnreadSectionHeading = styled(SectionHeading).attrs({
  className: 'unread-announcements-heading',
  'aria-label': 'unread announcements',
  children: (
    <MessageTypeHeading component="h2" variant="h6">
      Unread
    </MessageTypeHeading>
  )
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
`

const ReadSectionHeading = styled(SectionHeading).attrs({
  className: 'read-announcements-heading',
  'aria-label': 'read announcements',
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

const ReadStats = styled(Button).attrs({ className: 'read-stats' })`
  & .MuiButton-label {
    display: flex;
    flex-wrap: wrap;
  }

  & .MuiLinearProgress-determinate {
    border-radius: 0.25rem;
    height: 1.5rem;
    min-width: 8rem;
    margin-left: 1ch;
  }
`

const StatsButton = observer(function StatsButton({
  announcement
}: {
  announcement: AnnouncementInstanceType
}) {
  if (announcement.stats) {
    return (
      <ReadStats variant="outlined">
        <Typography variant="caption">Read Confirmations:</Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1ch'
          }}
        >
          <LinearProgress
            variant="determinate"
            value={announcement.stats.readPercentage}
          />
          <Typography
            variant="caption"
            component="div"
            color="textSecondary"
          >{`${Math.round(announcement.stats.readPercentage)}%`}</Typography>
        </div>
      </ReadStats>
    )
  } else {
    return (
      <ReadStats disabled>
        <Typography variant="caption">
          Read Confirmations Stats Unavailable
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
  keepExpanded = false
}: {
  announcement: AnnouncementInstanceType
  keepExpanded?: boolean
}) {
  const { id, summary, details, publishOn, status, priority } = announcement
  const [expanded, setExpanded] = React.useState(status === 'unread')
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
        {store.announcements.editMode ? (
          <Buttons>
            <StatsButton announcement={announcement} />
            <Button
              style={{ wordBreak: 'keep-all' }}
              variant="outlined"
              color="primary"
            >
              Edit
            </Button>
          </Buttons>
        ) : (
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

const NewDraft = observer(function NewDraft() {
  const store = useMst()

  if (!store.announcements.editMode?.newDraft) return null

  return (
    <div>
      <Title>New Announcement</Title>
      <form>
        <StyledTextField
          name="draft-summary"
          label="Summary"
          placeholder="Enter a one-line summary here"
          fullWidth
          value={store.announcements.editMode.newDraft.summary}
          onChange={e =>
            store.announcements.editMode?.newDraft?.setSummary(e.target.value)
          }
        />
        <StyledTextField
          name="draft-details"
          label="Details"
          placeholder="Full announcement contents"
          multiline
          rows={6}
          fullWidth
          value={store.announcements.editMode.newDraft.details}
          onChange={e =>
            store.announcements.editMode?.newDraft?.setDetails(e.target.value)
          }
        />
        <DateTimePicker
          style={{ minWidth: '20rem' }}
          variant="dialog"
          format="ddd, MMM DD, YYYY hh:mm a"
          margin="normal"
          label="Publish On"
          value={store.announcements.editMode.newDraft.publishOn}
          onChange={e =>
            store.announcements.editMode?.newDraft?.setPublishOn(e?.toDate())
          }
          autoOk
        />
        <DateTimePicker
          style={{ minWidth: '20rem' }}
          variant="dialog"
          format="ddd, MMM DD, YYYY hh:mm a"
          margin="normal"
          label="Publish end"
          value={store.announcements.editMode.newDraft.publishEnd}
          onChange={e =>
            store.announcements.editMode?.newDraft?.setPublishEnd(e?.toDate())
          }
          autoOk
        />
        <FormControlLabel
          label="Mark as important"
          control={
            <Switch
              checked={
                store.announcements.editMode.newDraft.priority === 'high'
              }
              onChange={() =>
                store.announcements.editMode?.newDraft?.togglePriority()
              }
            />
          }
        />{' '}
        <br />
        <FormControlLabel
          label="Actively send announcement via email / push notification"
          control={
            <Switch
              checked={store.announcements.editMode.newDraft.sendNotification}
              onChange={() =>
                store.announcements.editMode?.newDraft?.toggleNotify()
              }
            />
          }
        />
        <br />
        <Button color="primary" variant="outlined">
          Save
        </Button>
        <br />
        <Button color="primary" variant="contained">
          Save
        </Button>
        <br />
        <Button color="primary">💾</Button> <br />
        <Button color="primary" variant="outlined">
          💾
        </Button>
        <br />
        <Button color="primary" variant="contained">
          💾
        </Button>
        <br />
        <IconButton>
          <SaveIcon />
        </IconButton>{' '}
        <br />
        <IconButton>
          <SaveOutlinedIcon />
        </IconButton>
      </form>
    </div>
  )
})

function AnnouncementsPage() {
  const store = useMst()
  const loggedInType = store.loggedInUser?.type
  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <ScrollablePageContentWrapper>
        {loggedInType === 'staff' && (
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
        )}
        {!!store.announcements.editMode &&
          !store.announcements.editMode.newDraft && (
            <EditLine>
              <IconButton
                onClick={() => store.announcements.editMode!.startNewDraft()}
              >
                <AddIcon />
              </IconButton>
            </EditLine>
          )}
        <NewDraft />
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
        {!!store.announcements.editMode ? (
          <Section $classPrefix="all">
            {store.announcements.all.length ? <AllSectionHeading /> : undefined}
            {store.announcements.all.map(announcement => (
              <Announcement
                announcement={announcement}
                key={announcement.id}
                keepExpanded
              />
            ))}
          </Section>
        ) : (
          <>
            <Section $classPrefix="unread">
              {store.announcements.unread.length ? (
                <UnreadSectionHeading />
              ) : undefined}
              {store.announcements.unread.map(announcement => (
                <Announcement
                  announcement={announcement}
                  key={announcement.id}
                />
              ))}
            </Section>
            <Section $classPrefix="read">
              {store.announcements.read.length ? (
                <ReadSectionHeading />
              ) : undefined}
              {store.announcements.read.map(announcement => (
                <Announcement
                  announcement={announcement}
                  key={announcement.id}
                />
              ))}
            </Section>
          </>
        )}
      </ScrollablePageContentWrapper>
    </MuiPickersUtilsProvider>
  )
}

export default observer(AnnouncementsPage)
