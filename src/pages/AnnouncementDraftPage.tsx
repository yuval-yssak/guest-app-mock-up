import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
import { useForm } from 'react-hook-form'

import { useMst } from '../models/reactHook'
import TextField from '@material-ui/core/TextField'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'

// A "Field" contains the field and its error message
const Field = styled.div.attrs({ className: 'form-field' })`
  position: relative;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

// give room for error message
const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 0.8rem;
  }
`

const FormError = styled(Typography).attrs({
  className: 'form-error',
  variant: 'body2'
})`
  color: ${({ theme }) => theme.palette.secondary.dark};
  position: absolute;
  bottom: -0.7rem;
`

const NewAnnouncementWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: clamp(14.5rem, 80%, 60rem);
`

// A line wrapper in a form
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

type Inputs = {
  draftSubject: string
  draftBodyText: string
  draftPublishOn: Dayjs | null
  draftPublishEnd: Dayjs
}

const AnnouncementDraftPage = observer(function NewDraft() {
  const store = useMst()

  // use React Hook Form to validate input when "touched"
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger
  } = useForm<Inputs>({ mode: 'onTouched' })

  if (!store.announcements.editMode?.newDraft)
    return <div>Cannot create a new announcement</div>

  function save(_data: Inputs) {
    store.announcements.saveDraft()
    store.view.openAnnouncementsPage()
  }

  // register all fields with their validation rules
  const draftSubject = register('draftSubject', {
    required: true,
    maxLength: 80
  })
  const draftBodyText = register('draftBodyText', { required: true })
  const draftPublishOn = register('draftPublishOn', {
    validate: {
      beforeNow: date =>
        date ? dayjs().isBefore(dayjs(date.toString())) : true
    }
  })
  const draftPublishEnd = register('draftPublishEnd', {
    required: true,
    validate: {
      afterPublishOnDate: date => {
        const publishOnDate = dayjs(getValues('draftPublishOn') || undefined)

        return date
          ? dayjs(date.toString()).isAfter(publishOnDate.add(15, 'minutes'))
          : true
      }
    }
  })

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <NewAnnouncementWrapper>
        <form onSubmit={handleSubmit(save)}>
          <Field>
            <StyledTextField
              label="Subject"
              placeholder="Enter a one-line subject here"
              fullWidth
              value={store.announcements.editMode.newDraft.subject}
              {...draftSubject}
              onChange={e => {
                // override React Hook Form register with update to store
                store.announcements.editMode?.newDraft?.setSubject(
                  e.target.value
                )
                draftSubject.onChange(e)
              }}
            />
            {errors.draftSubject?.type === 'required' && (
              <FormError>* This field is required</FormError>
            )}
            {errors.draftSubject?.type === 'maxLength' && (
              <FormError>* maximum 80 Characters</FormError>
            )}
          </Field>
          <Field>
            <StyledTextField
              label="Body Text"
              placeholder="Full announcement contents"
              multiline
              rows={6}
              fullWidth
              value={store.announcements.editMode.newDraft.bodyText}
              {...draftBodyText}
              onChange={e => {
                store.announcements.editMode?.newDraft?.setBodyText(
                  e.target.value
                )
                draftBodyText.onChange(e)
              }}
            />
            {errors.draftBodyText && (
              <FormError>* This field is required</FormError>
            )}
          </Field>
          <Wrapper>
            <Field>
              <StyledDateTimePicker
                variant="dialog"
                format="ddd, MMM DD, YYYY hh:mm a"
                margin="normal"
                label="Start publishing on"
                minDate={dayjs().toDate()}
                value={store.announcements.editMode.newDraft.publishOn}
                // supply name, onBlur, inputRef and onChange to rhf with modifications
                name={draftPublishOn.name}
                onBlur={draftPublishOn.onBlur}
                inputRef={draftPublishOn.ref}
                onChange={date => {
                  store.announcements.editMode?.newDraft?.setPublishOn(
                    date?.toDate() || null
                  )
                  setValue('draftPublishOn', date, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                  // trigger validation on publishEnd field
                  trigger('draftPublishEnd')
                }}
                autoOk
                clearable // OK to clear this field. When empty - it means "start now"
              />
              {errors.draftPublishOn?.type === 'beforeNow' && (
                <FormError>* Cannot backdate publishing date</FormError>
              )}
            </Field>
            <Field>
              <StyledDateTimePicker
                variant="dialog"
                format="ddd, MMM DD, YYYY hh:mm a"
                margin="normal"
                label="Stop publishing on"
                minDate={
                  store.announcements.editMode.newDraft.publishOn ||
                  dayjs().toDate()
                }
                minDateMessage={<></>}
                value={store.announcements.editMode.newDraft.publishEnd}
                name={draftPublishEnd.name}
                onBlur={draftPublishEnd.onBlur}
                inputRef={draftPublishEnd.ref}
                onChange={date => {
                  store.announcements.editMode?.newDraft?.setPublishEnd(
                    date!.toDate()
                  )

                  setValue('draftPublishEnd', dayjs(date!.toString()), {
                    shouldValidate: true,
                    shouldDirty: true
                  })
                }}
                autoOk
              />
              {errors.draftPublishEnd && (
                <FormError>* minimum 15 minute duration</FormError>
              )}
            </Field>
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
            <PrimaryButton type="submit">Save</PrimaryButton>
          </Wrapper>
        </form>
      </NewAnnouncementWrapper>
    </MuiPickersUtilsProvider>
  )
})

export default AnnouncementDraftPage
