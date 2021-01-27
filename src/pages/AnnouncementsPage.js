import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import styled from "styled-components";

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
`;

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
`;

const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
    justify-items: end;
  }
`;

export default function AnnouncementsPage() {
  return (
    <StyledPaper elavation={2}>
      <Title component="h1">Announcements</Title>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
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
          <Button variant="contained" color="primary">
            Confirm
          </Button>
        </StyledAccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>
            A guest reported symptoms on Tuesday, Aug 11th
          </Typography>
        </AccordionSummary>
        <StyledAccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi enim
            blanditiis amet ipsam facilis consequatur velit cupiditate nostrum,
            necessitatibus laborum rerum nisi debitis cum neque aliquid
            praesentium repudiandae. Mollitia, sunt.
          </Typography>
        </StyledAccordionDetails>
      </Accordion>
    </StyledPaper>
  );
}
