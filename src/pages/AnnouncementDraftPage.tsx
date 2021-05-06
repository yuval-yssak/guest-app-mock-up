import React from 'react'
import { observer } from 'mobx-react-lite'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import styled from 'styled-components'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'

import { useMst } from '../models/reactHook'
import TextField from '@material-ui/core/TextField'

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 0.8rem;
  }
`

const NewAnnouncementWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: clamp(14.5rem, 80%, 60rem);
`

const Wrapper = styled.div<{ $alignToRight?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;

  ${({ $alignToRight }) =>
    $alignToRight &&
    `
      justify-content: flex-end;
      column-gap: 0.5rem;
      row-gap: 0.5rem;
      
  `}
`

const StyledDateTimePicker = styled(DateTimePicker)`
  && {
    min-width: 15rem;
  }
`

const AnnouncementDraftPage = observer(function NewDraft() {
  const store = useMst()

  if (!store.announcements.editMode?.newDraft) return null

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <NewAnnouncementWrapper>
        <form>
          <StyledTextField
            name="draft-summary"
            label="Subject"
            placeholder="Enter a one-line subject here"
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
          <Wrapper>
            <StyledDateTimePicker
              variant="dialog"
              format="ddd, MMM DD, YYYY hh:mm a"
              margin="normal"
              label="Publish On"
              value={store.announcements.editMode.newDraft.publishOn}
              onChange={e =>
                store.announcements.editMode?.newDraft?.setPublishOn(
                  e?.toDate()
                )
              }
              autoOk
            />
            <StyledDateTimePicker
              variant="dialog"
              format="ddd, MMM DD, YYYY hh:mm a"
              margin="normal"
              label="Publish end"
              value={store.announcements.editMode.newDraft.publishEnd}
              onChange={e =>
                store.announcements.editMode?.newDraft?.setPublishEnd(
                  e?.toDate()!
                )
              }
              autoOk
            />
          </Wrapper>
          <br />
          <Wrapper>
            <FormControlLabel
              label="Important"
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
            />
            <FormControlLabel
              label="Push notification"
              control={
                <Switch
                  checked={
                    store.announcements.editMode.newDraft.sendNotification
                  }
                  onChange={() =>
                    store.announcements.editMode?.newDraft?.toggleNotify()
                  }
                />
              }
            />
          </Wrapper>
          <Wrapper $alignToRight>
            <Button
              onClick={() => store.view.openAnnouncementsPage()}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              variant="outlined"
              onClick={() => store.announcements.editMode?.clearDraft()}
            >
              Clear
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ fontWeight: 400 }}
              onClick={() => {
                if (
                  store.announcements.editMode?.newDraft?.summary.trim() &&
                  store.announcements.editMode?.newDraft.details.trim()
                ) {
                  store.announcements.saveDraft()
                  store.view.openAnnouncementsPage()
                }
              }}
            >
              Save
            </Button>
          </Wrapper>
        </form>
      </NewAnnouncementWrapper>
    </MuiPickersUtilsProvider>
  )
})

export default AnnouncementDraftPage
