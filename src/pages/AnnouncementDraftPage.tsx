import React from 'react'
import { observer } from 'mobx-react-lite'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import styled from 'styled-components'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'

import { useMst } from '../models/reactHook'
import TextField from '@material-ui/core/TextField'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'

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
            name="draft-subject"
            label="Subject"
            placeholder="Enter a one-line subject here"
            fullWidth
            value={store.announcements.editMode.newDraft.subject}
            onChange={e =>
              store.announcements.editMode?.newDraft?.setSubject(e.target.value)
            }
          />
          <StyledTextField
            name="draft-body-text"
            label="Body Text"
            placeholder="Full announcement contents"
            multiline
            rows={6}
            fullWidth
            value={store.announcements.editMode.newDraft.bodyText}
            onChange={e =>
              store.announcements.editMode?.newDraft?.setBodyText(
                e.target.value
              )
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
            <SecondaryButton onClick={() => store.view.openAnnouncementsPage()}>
              Back
            </SecondaryButton>
            <SecondaryButton
              onClick={() => store.announcements.editMode?.clearDraft()}
            >
              Clear
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                if (
                  store.announcements.editMode?.newDraft?.subject.trim() &&
                  store.announcements.editMode?.newDraft.bodyText.trim()
                ) {
                  store.announcements.saveDraft()
                  store.view.openAnnouncementsPage()
                }
              }}
            >
              Save
            </PrimaryButton>
          </Wrapper>
        </form>
      </NewAnnouncementWrapper>
    </MuiPickersUtilsProvider>
  )
})

export default AnnouncementDraftPage
