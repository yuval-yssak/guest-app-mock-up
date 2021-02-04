import React from 'react'
import { observer } from 'mobx-react-lite'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionActions from '@material-ui/core/AccordionActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'

import styled from 'styled-components'
import PageMainPaper from '../components/PageMainPaper'

import { useMst } from '../models/reactHook'
import dayjs from 'dayjs'

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
    justify-items: end;
  }
`

const ScrollablePageMainPaper = styled(PageMainPaper).attrs({
  className: 'scrollable'
})`
  && {
    height: 100%;
    overflow: scroll;
    grid-template-rows: min-content 1fr;
    align-items: center;
  }
`

const Section = styled.section.attrs(({ $type }) => ({
  className: `${$type}-announcements`
}))`
  padding: 0.5rem;

  && .MuiAccordion-root {
    margin-top: 0;
  }

  // give a bold font for summaries under the unread category
  ${({ $type }) =>
    $type === 'unread' &&
    `
  & .announcement-summary {
    font-weight: 800;
  }`}
`

const StyledAccordionSummary = styled(AccordionSummary)`
  & .announcement-summary {
    ${({ $expanded }) => $expanded && `font-weight:800;`}
  }
`

const MessageTypeHeading = styled(Typography)`
  line-height: 1;
`

const SectionHeading = styled.div`
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 0.5rem 1rem;
`

const UnreadSectionHeading = styled(SectionHeading).attrs({
  className: 'unread-message-heading',
  'aria-label': 'unread messages',
  children: <MessageTypeHeading variant="h6">Unread</MessageTypeHeading>
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
`

const ReadSectionHeading = styled(SectionHeading).attrs({
  className: 'read-message-heading',
  'aria-label': 'read messages',
  children: <MessageTypeHeading variant="h6">Read</MessageTypeHeading>
})`
  background-color: #ffdca4;
`

const AnnouncementHead = styled.div.attrs({
  className: 'announcement-head'
})`
  display: grid;
  grid-template-columns: minmax(min-content, max-content) max-content;
  width: 100%;
  justify-content: space-between;
`

function Announcement({ announcement }) {
  const { id, summary, details, timestamp, status } = announcement
  const [expanded, setExpanded] = React.useState(status === 'unread')

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
        <AnnouncementHead>
          <Typography className="announcement-summary">{summary}</Typography>
          <Typography>{dayjs(timestamp).format('MMM D, YYYY')}</Typography>
        </AnnouncementHead>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Typography>{details}</Typography>
      </StyledAccordionDetails>
      <AccordionActions>
        <Button variant="outlined" size="small">
          Respond
        </Button>
        {status === 'unread' && (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => announcement.toggle()}
          >
            Confirm
          </Button>
        )}
      </AccordionActions>
    </Accordion>
  )
}

const getAnnouncementComponent = announcement => (
  <Announcement announcement={announcement} key={announcement.id} />
)

function AnnouncementsPage() {
  const { announcements } = useMst()
  return (
    <ScrollablePageMainPaper role="article" elevation={0}>
      <Section $type="unread">
        {announcements.unread.length ? <UnreadSectionHeading /> : undefined}
        {announcements.unread.map(getAnnouncementComponent)}
      </Section>
      <Section $type="read">
        {announcements.read.length ? <ReadSectionHeading /> : undefined}
        {announcements.read.map(getAnnouncementComponent)}
      </Section>
    </ScrollablePageMainPaper>
  )
}

export default observer(AnnouncementsPage)
