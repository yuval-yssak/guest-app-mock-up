import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

import styled from 'styled-components'

const StyledPaper = styled(Paper)`
  && {
    padding: 4rem 3rem;
    display: grid;
    grid-template-rows: min-content 1fr;
    grid-gap: 2rem;
    align-items: center;
    max-width: min(70rem, 80%);
    background-color: transparent;

    @media (max-width: 36.5em) {
      padding: 1.5rem 1rem;
      max-width: 100%;
    }
  }
`

const Title = styled(Typography)`
  && {
    text-align: center;
    font-size: 3rem;

    @media (max-width: 24em) {
      font-size: 2rem;
      font-weight: 800;
    }

    @media (max-width: 18em) {
      font-size: 1.5rem;
    }
  }
`

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

const Buttons = styled.div.attrs({ className: 'buttons-array' })`
  display: grid;
  grid-gap: 0.8rem;
  grid-auto-flow: column;
`

export default function AnnouncementsPage() {
  return (
    <StyledPaper role="article" elavation={2}>
      <Title component="h1">Announcements</Title>
      <TempStyledTypography>Unread:</TempStyledTypography>
      <Section $type="unread">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="message-1-content"
            id="message-1-header"
          >
            <Typography>
              New sanitization station near the bay west platform
            </Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <Typography>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non
              assumenda facilis quidem. Nostrum architecto cumque qui! Tempore
              deserunt libero, temporibus quis corrupti eveniet, ipsa minus
              exercitationem itaque in, nobis veniam?
            </Typography>

            <Buttons>
              <Button variant="contained" color="primary">
                Confirm
              </Button>
              <Button variant="contained" color="secondary">
                Respond
              </Button>
            </Buttons>
          </StyledAccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="message-2-content"
            id="message-2-header"
          >
            <Typography>
              A miracle vaccine is now ditributed free without side effects!
            </Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam at
              harum aliquam in reiciendis, accusamus odio perspiciatis, debitis
              voluptas, culpa ea impedit ex praesentium asperiores eius aut
              velit quos eum.
            </Typography>
            <Buttons>
              <Button variant="contained" color="primary">
                Confirm
              </Button>
              <Button variant="contained" color="secondary">
                Respond
              </Button>
            </Buttons>
          </StyledAccordionDetails>
        </Accordion>
      </Section>
      <TempStyledTypography>Read:</TempStyledTypography>
      <Section $type="read">
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="message-3-content"
            id="message-3-header"
          >
            <Typography>
              A guest reported symptoms on Tuesday, Aug 11th
            </Typography>
          </AccordionSummary>
          <StyledAccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi enim
              blanditiis amet ipsam facilis consequatur velit cupiditate
              nostrum, necessitatibus laborum rerum nisi debitis cum neque
              aliquid praesentium repudiandae. Mollitia, sunt.
            </Typography>
            <Buttons>
              <Button variant="contained" color="secondary">
                Respond
              </Button>
            </Buttons>
          </StyledAccordionDetails>
        </Accordion>
      </Section>
    </StyledPaper>
  )
}
