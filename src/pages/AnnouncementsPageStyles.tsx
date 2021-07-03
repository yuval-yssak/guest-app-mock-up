import styled from 'styled-components'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import PageContentWrapper from '../components/PageContentWrapper'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ToggleButton from '@material-ui/core/ToggleButton'
import TextField from '@material-ui/core/TextField'
import { SecondaryButton } from '../components/common/Buttons'

export const breakpointSplitHead = '(max-width: 45em)'

export const StyledAccordionDetails = styled(AccordionDetails)`
  && {
    display: grid;
  }
`

export const ScrollablePageContentWrapper = styled(PageContentWrapper).attrs({
  className: 'scrollable'
})`
  word-break: break-word;

  && {
    overflow-y: scroll;
    grid-template-rows: min-content 1fr;
    align-items: start;
  }
`

export const Section = styled.section.attrs(
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

export const StyledAccordionSummary = styled(AccordionSummary)<{
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

export const AllSectionHeading = styled(SectionHeading).attrs({
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

export const UnreadSectionHeading = styled(SectionHeading).attrs({
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

export const ReadSectionHeading = styled(SectionHeading).attrs({
  className: 'read-announcements-heading',
  'aria-label': 'read announcements',
  children: (
    <AnnouncementTypeHeading component="h2" variant="h6">
      Read
    </AnnouncementTypeHeading>
  )
})`
  background-color: ${({ theme }) =>
    theme.palette.grey[theme.palette.mode === 'dark' ? '500' : '300']};
`

export const AnnouncementHead = styled.div.attrs({
  className: 'announcement-head'
})<{ $priority: 'high' | 'low' }>`
  display: grid;
  grid-template-columns: minmax(min-content, 1fr) max-content ${({
      $priority
    }) => $priority === 'high' && 'max-content'};
  width: 100%;
  justify-content: space-between;
  align-items: center;
  grid-gap: 0.5rem;

  @media ${breakpointSplitHead} {
    grid-template-columns: 1fr;
  }
`

export const EditLine = styled.div.attrs({
  className: 'edit-management-line'
})<{
  $editModeOpen: boolean
}>`
  display: grid;
  ${({ $editModeOpen }) =>
    $editModeOpen
      ? `grid-template-columns: max-content minmax(min-content, 1fr) max-content;`
      : `justify-content: end;`}
  column-gap: 1rem;
  padding-top: 1rem;
  align-items: start;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
`

export const AnnouncementInfo = styled.div.attrs({
  className: 'announcement-info'
})`
  display: flex;
`

export const Important = styled(Typography).attrs({
  className: 'important',
  'aria-label': 'important'
})`
  && {
    font-weight: 500;
    letter-spacing: 1.2px;
    margin: 0 0.4rem;
  }
`

export const HighPriorityContainer = styled.div`
  display: flex;
`

export const ReadStats = styled(SecondaryButton).attrs({
  className: 'read-stats'
})`
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

export const Buttons = styled.div`
  display: flex;
`

export const NoAnnouncementsTitle = styled(Typography)`
  && {
    text-align: center;
    ${({ theme }) => theme.palette.type === 'dark' && `color:  #fff`};
  }
`

export const EmptyPagePaper = styled(Paper)`
  margin-top: 5%;
  padding: 3rem;
`

export const StyledFormControlLabel = styled(FormControlLabel)`
  flex-grow: 1;
  justify-content: flex-end;
`

export const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
`

// todo: reuse code (duplicate from UsersPane.tsx)
export const StyledSearchbar = styled(TextField).attrs({ type: 'search' })<{
  value: unknown // https://material-ui.com/guides/typescript/#handling-value-and-event-handlers
}>`
  // place the placeholder in the center when there is no search term.
  text-align: ${({ value }) => (value === '' ? `center` : `initial`)};
  flex: 1;

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

export const StyledToggleButton = styled(ToggleButton)`
  && {
    padding: 0.1875rem 0.5625rem;
  }
`
