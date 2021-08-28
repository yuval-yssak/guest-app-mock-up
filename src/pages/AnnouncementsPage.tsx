import React from 'react'
import { observer } from 'mobx-react-lite'
import Accordion from '@material-ui/core/Accordion'
import AccordionActions from '@material-ui/core/AccordionActions'
import AddIcon from '@material-ui/icons/Add'
import FlagIcon from '@material-ui/icons/Flag'
import ToggleButtonGroup from '@material-ui/core/ToggleButtonGroup'
import IconButton from '@material-ui/core/IconButton'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import LinearProgress from '@material-ui/core/LinearProgress'

import { useMst } from '../models/reactHook'
import dayjs from 'dayjs'
import { AnnouncementInstanceType } from '../models/AnnouncementsModel'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'
import {
  Important,
  HighPriorityContainer,
  ReadStats,
  breakpointSplitHead,
  StyledAccordionDetails,
  ScrollablePageContentWrapper,
  Section,
  StyledAccordionSummary,
  AllSectionHeading,
  UnreadSectionHeading,
  ReadSectionHeading,
  AnnouncementHead,
  EditLine,
  AnnouncementInfo,
  Buttons,
  NoAnnouncementsTitle,
  EmptyPagePaper,
  StyledFormControlLabel,
  StyledToggleButton
} from './AnnouncementsPageStyles'
import SearchBar from '../components/common/SearchBar'

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
        <Typography style={{ whiteSpace: 'pre-wrap' }} component="pre">
          {bodyText}
        </Typography>
      </StyledAccordionDetails>
      <AccordionActions>
        {store.announcements.editMode ? (
          <Buttons>
            <StatsButton announcement={announcement} />
            <PrimaryButton
              onClick={() =>
                store.view.openAnnouncementsEditPage(announcement.id)
              }
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

function HighPriority({ withAnnotation }: { withAnnotation: boolean }) {
  return (
    <HighPriorityContainer>
      <FlagIcon color="primary" />
      {withAnnotation && <Important color="primary">Important</Important>}
    </HighPriorityContainer>
  )
}

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
  const loggedInType = store.loggedInUser?.type
  const [view, setView] = React.useState<'active' | 'archived'>('active')
  const [searchTerm, setSearchTerm] = React.useState('')
  const smallScreen = useMediaQuery('(max-width: 37.5em)')
  const verySmallScreen = useMediaQuery('(max-width: 24em)')

  const viewedAnnouncements =
    view === 'active'
      ? store.announcements.active
      : store.announcements.archived

  return (
    <ScrollablePageContentWrapper>
      {loggedInType === 'staff' && (
        <EditLine $editModeOpen={!!store.announcements.editMode}>
          {!!store.announcements.editMode && (
            <>
              <Tooltip title="Create a new announcement">
                <IconButton
                  style={{ backgroundColor: '#eee' }}
                  onClick={() => store.view.openAnnouncementsNewDraftPage()}
                  size="small"
                >
                  <AddIcon color="primary" />
                </IconButton>
              </Tooltip>
              <ToggleButtonGroup
                size="small"
                value={view}
                exclusive
                onChange={() =>
                  setView(view => (view === 'active' ? 'archived' : 'active'))
                }
                aria-label="view selection"
                style={{ flexWrap: 'wrap' }}
              >
                <StyledToggleButton value="active" aria-label="active">
                  {smallScreen ? 'Active' : 'Active/Scheduled'}
                </StyledToggleButton>
                <StyledToggleButton value="archived" aria-label="archived">
                  Archived
                </StyledToggleButton>
              </ToggleButtonGroup>
            </>
          )}
          <StyledFormControlLabel
            label={verySmallScreen ? 'Edit' : 'Edit Mode'}
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
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <Tooltip title="Advanced search">
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          {!!viewedAnnouncements.length && <AllSectionHeading />}
          {viewedAnnouncements
            .filter(a => a.subject.match(new RegExp(searchTerm.trim(), 'i')))
            .map(announcement => (
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
