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
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.4rem;

  // give a bold font for summaries under the unread category
  ${({ $type }) =>
    $type === 'unread' &&
    `
  & .MuiAccordionSummary-content p {
    font-weight: 800;
  }`}
`

const TempStyledTypography = styled(Typography)`
  && {
    margin-bottom: -3rem; // TODO: lay out properly
    color: darkred;
    font-weight: 800;
  }
`

const StyledAccordionSummary = styled(AccordionSummary)`
  & p {
    ${({ $expanded }) => $expanded && `font-weight:800;`}
  }
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
      <TempStyledTypography>Unread:</TempStyledTypography>
      <Section $type="unread">
        {announcements.unread.map(getAnnouncementComponent)}
      </Section>
      <TempStyledTypography>Read:</TempStyledTypography>
      <Section $type="read">
        {announcements.read.map(getAnnouncementComponent)}
      </Section>
    </ScrollablePageMainPaper>
  )
}

export default observer(AnnouncementsPage)
