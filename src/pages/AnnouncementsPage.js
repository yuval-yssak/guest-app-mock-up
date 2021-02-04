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
  & .MuiAccordionSummary-content p {
    font-weight: 800;
  }`}
`

const StyledAccordionSummary = styled(AccordionSummary)`
  & p {
    ${({ $expanded }) => $expanded && `font-weight:800;`}
  }
`

const MessageTypeHeading = styled(Typography)`
  line-height: 1;
`

const UnreadSectionHeading = styled.div.attrs({
  className: 'unread-message-heading',
  'aria-label': 'unread messages',
  children: <MessageTypeHeading variant="h6">Unread</MessageTypeHeading>
})`
  background-color: ${({ theme }) => theme.palette.primary.light};
  padding: 0.5rem 1rem;
`

const ReadSectionHeading = styled.div.attrs({
  className: 'read-message-heading',
  'aria-label': 'read messages',
  children: <MessageTypeHeading variant="h6">Read</MessageTypeHeading>
})`
  background-color: #ffdca4;
  padding: 0.5rem 1rem;
`

function Announcement({ id, summary, details, timestamp, status }) {
  const { announcements } = useMst()
  const [expanded, setExpanded] = React.useState(status === 'unread')
  console.log('ann', status)
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
        <Typography>{summary}</Typography>
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
            onClick={() => announcements.announcementById(id).toggle()}
          >
            Confirm
          </Button>
        )}
      </AccordionActions>
    </Accordion>
  )
}

const getAnnouncementComponent = announcement => (
  <Announcement {...announcement} key={announcement.id} />
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
