import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionActions from '@material-ui/core/AccordionActions'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'

import styled from 'styled-components'
import PageMainPaper from '../components/PageMainPaper'

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
    justify-items: end;
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

function Announcement({ idPrefix, summary, details, read }) {
  const [expanded, setExpanded] = React.useState(false)
  React.useEffect(() => console.log(expanded), [expanded])
  return (
    <Accordion
      expanded={expanded}
      onChange={(_event, expanded) => setExpanded(expanded)}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${idPrefix}-content`}
        id={`${idPrefix}-header`}
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
        {!read && (
          <Button variant="outlined" size="small" color="primary">
            Confirm
          </Button>
        )}
      </AccordionActions>
    </Accordion>
  )
}

export default function AnnouncementsPage() {
  return (
    <PageMainPaper role="article" elavation={2}>
      <TempStyledTypography>Unread:</TempStyledTypography>
      <Section $type="unread">
        <Announcement
          idPrefix="message-1"
          summary="New sanitization station near the bay west platform"
          details="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non
              assumenda facilis quidem. Nostrum architecto cumque qui! Tempore
              deserunt libero, temporibus quis corrupti eveniet, ipsa minus
              exercitationem itaque in, nobis veniam?"
        />
        <Announcement
          idPrefix="message-2"
          summary="A miracle vaccine is now ditributed free without side effects!"
          details="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam at
          harum aliquam in reiciendis, accusamus odio perspiciatis, debitis
          voluptas, culpa ea impedit ex praesentium asperiores eius aut
          velit quos eum."
        />
      </Section>
      <TempStyledTypography>Read:</TempStyledTypography>
      <Section $type="read">
        <Announcement
          idPrefix="message-3"
          summary="A guest reported symptoms on Tuesday, Aug 11th"
          details="Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi enim
          blanditiis amet ipsam facilis consequatur velit cupiditate
          nostrum, necessitatibus laborum rerum nisi debitis cum neque
          aliquid praesentium repudiandae. Mollitia, sunt."
          read
        />
      </Section>
    </PageMainPaper>
  )
}
