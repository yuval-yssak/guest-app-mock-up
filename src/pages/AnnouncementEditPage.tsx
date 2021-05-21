import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Input from '@material-ui/core/Input'
import Skeleton from '@material-ui/lab/Skeleton'
import InputAdornment from '@material-ui/core/InputAdornment'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import Switch from '@material-ui/core/Switch'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers'
import styled from 'styled-components'
import DayjsUtils from '@date-io/dayjs'
import { FieldError, useForm } from 'react-hook-form'

import { useMst } from '../models/reactHook'
import TextField from '@material-ui/core/TextField'
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons'
import { AnnouncementInstanceType } from '../models/AnnouncementsModel'
import { clone, applySnapshot, getSnapshot } from 'mobx-state-tree'

import minMax from 'dayjs/plugin/minMax'

dayjs.extend(minMax)

// A "Field" contains the field and its error message
const Field = styled.div.attrs({ className: 'form-field' })`
  position: relative;
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
  bottom: 0.7rem;
  transform: translateY(100%);
`

const StyledListSubheader = styled(ListSubheader).attrs({
  disableSticky: true
})<{ $secondary?: boolean }>`
  && {
    color: #aaa;
    ${({ $secondary }) => $secondary && `margin-left: 1rem;`}
  }
`

const NewAnnouncementWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  width: clamp(14.5rem, 80%, 60rem);
  margin-top: '1rem';
`

// A line wrapper in a form
const Wrapper = styled.div.attrs({ className: 'line-wrapper' })<{
  $alignToRight?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  width: 100%;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

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
    margin-bottom: 0.8rem;
  }
`

const StyledInput = styled(Input)`
  && {
    margin-bottom: 0.8rem;
    cursor: pointer;
  }

  && input,
  && .MuiInputAdornment-root,
  && .MuiInputBase-root {
    cursor: pointer;
  }
`

const MultilineListItem = styled(ListItem)`
  && {
    white-space: normal;
    display: flex;
    column-gap: 0.5rem;
  }
`

const ElevatedPaper = styled(Paper).attrs({ elevation: 2 })`
  margin: 1rem;
`

const AudienceSegmentName = styled(Typography).attrs({ variant: 'body1' })`
  flex: 1;
`

const AudienceCountChip = styled(Chip).attrs({
  color: 'primary',
  variant: 'outlined'
})``

type formInputs = {
  draftSubject: string
  draftBodyText: string
  draftAudience: AnnouncementInstanceType['audience']['targetName']
  draftPublishOn: Dayjs | null
  draftPublishEnd: Dayjs
}

function getAudienceTargetLabel(
  audienceTarget: AnnouncementInstanceType['audience']
) {
  switch (audienceTarget.targetName) {
    case 'all-residents-and-visitors':
      return 'All current residents & day visitors'
    case 'all-residents':
      return 'All current residents (anyone taking lodging)'
    case 'all-residents-guests':
      return 'All paying guests including children'
    case 'all-residents-guests-no-children':
      return 'All paying guests excluding children'
    case 'all-staff-karma-yogis':
      return 'All staff & karma yogis'
    case 'all-karma-yogis':
      return 'All karma yogis'
    case 'all-staff':
      return 'All staff'
    case 'all-speakers':
      return 'All speakers'
    case 'students-in-course':
      return `Students in Course ${audienceTarget.id}`
    default:
      return ''
  }
}

function EditAnnouncementComponent(
  props: {
    save: () => void
    subject: string
    setSubject: (newSubject: string) => void
    bodyText: string
    setBodyText: (newBodyText: string) => void
    audience: AnnouncementInstanceType['audience']
    setAudience: (newAudience: AnnouncementInstanceType['audience']) => void
    publishOn: Date | null
    setPublishOn: (newPublishOn: Date | null) => void
    publishEnd: Date
    setPublishEnd: (newPublishOn: Date) => void
    priority: AnnouncementInstanceType['priority']
    togglePriority: () => void
    sendAlert: boolean
    toggleNotify: () => void
    goBack: () => void
    reset: () => void
  } & (
    | { mode: 'edit'; originalPublishOn: Date; originalPublishEnd: Date }
    | { mode: 'new' }
  )
) {
  const {
    save,
    subject,
    setSubject,
    bodyText,
    setBodyText,
    audience,
    setAudience,
    publishOn,
    setPublishOn,
    publishEnd,
    setPublishEnd,
    priority,
    togglePriority,
    sendAlert,
    toggleNotify,
    goBack,
    reset,
    mode
  } = props

  // use React Hook Form to validate input when "touched"
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
    trigger
  } = useForm<formInputs>({ mode: 'onTouched' })

  function publishOnDisabledLogic() {
    if (props.mode === 'edit') return dayjs().isAfter(props.originalPublishOn)
    else return false
  }

  function publishEndDisabledLogic() {
    if (props.mode === 'edit') return dayjs().isAfter(props.originalPublishEnd)
    else return false
  }

  function getMinDateForPublishEnd() {
    if (props.mode === 'edit')
      return publishEndDisabledLogic()
        ? new Date(0)
        : dayjs.max(dayjs(), dayjs(props.originalPublishOn)).toDate()
    else return publishOn || dayjs().toDate()
  }
  // register all fields with their validation rules
  const draftSubject = register('draftSubject', {
    required: true,
    maxLength: 80
  })
  const draftBodyText = register('draftBodyText', { required: true })
  const draftAudience = register('draftAudience', { required: true })
  const draftPublishOn = register('draftPublishOn', {
    validate: {
      beforeNow: date =>
        !publishOnDisabledLogic() &&
        (date ? dayjs().isBefore(dayjs(date.toString())) : true)
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

  const originalPublishOn = props.mode === 'edit' && props.originalPublishOn

  const [populationLoaded, setPopulationLoaded] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => setPopulationLoaded(true), 4500)
  }, [])

  React.useEffect(() => {
    if (props.mode === 'edit' && originalPublishOn) {
      setValue('draftSubject', subject)
      setValue('draftBodyText', bodyText)
      setValue('draftPublishOn', dayjs(originalPublishOn))
      setValue('draftAudience', audience.targetName)
    }
  }, [setValue, bodyText, props.mode, originalPublishOn, subject, audience])

  const [audienceDialogOpen, setAudienceDialogOpen] = React.useState(false)

  const setAndClose = (value: AnnouncementInstanceType['audience']) => {
    setAudience(value)
    setAudienceDialogOpen(false)
  }

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <NewAnnouncementWrapper>
        <form onSubmit={handleSubmit(save)}>
          <Wrapper>
            <Field>
              <StyledTextField
                label="Subject"
                placeholder="Enter a one-line subject here"
                fullWidth
                value={subject}
                {...draftSubject}
                disabled={mode === 'edit'}
                onChange={e => {
                  if (mode === 'new') {
                    // override React Hook Form register with update to store
                    setSubject(e.target.value)
                    draftSubject.onChange(e)
                  }
                }}
              />
              {errors.draftSubject?.type === 'required' && (
                <FormError>* This field is required</FormError>
              )}
              {errors.draftSubject?.type === 'maxLength' && (
                <FormError>* Maximum 80 Characters</FormError>
              )}
            </Field>
          </Wrapper>
          <Wrapper>
            <Field>
              <StyledTextField
                label="Body Text"
                placeholder="Full announcement contents"
                multiline
                rows={6}
                fullWidth
                value={bodyText}
                {...draftBodyText}
                disabled={mode === 'edit'}
                onChange={e => {
                  if (mode === 'new') {
                    setBodyText(e.target.value)
                    draftBodyText.onChange(e)
                  }
                }}
              />
              {errors.draftBodyText && (
                <FormError>* This field is required</FormError>
              )}
            </Field>
          </Wrapper>
          <Wrapper>
            <Field>
              <InputLabel style={{ width: '100%' }}>
                Audience
                <br />
                <StyledInput
                  fullWidth
                  name={draftAudience.name}
                  onBlur={e => {
                    draftAudience.onBlur(e)
                    trigger('draftAudience')
                  }}
                  inputRef={draftAudience.ref}
                  onChange={e => {
                    draftAudience.onChange(e)
                  }}
                  onClick={() => setAudienceDialogOpen(true)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setAudienceDialogOpen(true)
                    }
                    trigger('draftAudience')
                  }}
                  value={getAudienceTargetLabel(audience)}
                  endAdornment={
                    <InputAdornment position="end">
                      <ArrowDropDownIcon />
                    </InputAdornment>
                  }
                />
              </InputLabel>
              <Dialog
                onClose={() => setAudienceDialogOpen(false)}
                aria-labelledby="simple-dialog-title"
                open={audienceDialogOpen}
              >
                <DialogTitle id="simple-dialog-title">
                  Choose Announcement Audience
                </DialogTitle>
                <ElevatedPaper>
                  <StyledListSubheader>Everyone present</StyledListSubheader>
                  <AudienceTargetItem
                    name="all-residents-and-visitors"
                    count={270}
                    setSelected={setAndClose}
                    value={audience.targetName}
                    disabled={mode === 'edit'}
                  />
                </ElevatedPaper>
                <ElevatedPaper>
                  <StyledListSubheader>Resident Audience</StyledListSubheader>
                  <List>
                    <AudienceTargetItem
                      name="all-residents"
                      count={259}
                      setSelected={setAndClose}
                      value={audience.targetName}
                      disabled={mode === 'edit'}
                    />
                    <StyledListSubheader $secondary>
                      Resident Guests
                    </StyledListSubheader>

                    <AudienceTargetItem
                      name="all-residents-guests"
                      count={184}
                      setSelected={setAndClose}
                      value={audience.targetName}
                      disabled={mode === 'edit'}
                    />
                    <AudienceTargetItem
                      name="all-residents-guests-no-children"
                      count={182}
                      setSelected={setAndClose}
                      value={audience.targetName}
                      disabled={mode === 'edit'}
                      waitWithSkeleton={populationLoaded}
                    />
                  </List>
                  <StyledListSubheader $secondary>
                    Resident Staff/Karma Yogis
                  </StyledListSubheader>
                  <AudienceTargetItem
                    name="all-staff-karma-yogis"
                    count={122}
                    setSelected={setAndClose}
                    value={audience.targetName}
                    disabled={mode === 'edit'}
                    waitWithSkeleton={populationLoaded}
                  />
                  <AudienceTargetItem
                    name="all-karma-yogis"
                    count={68}
                    setSelected={setAndClose}
                    value={audience.targetName}
                    disabled={mode === 'edit'}
                    waitWithSkeleton={populationLoaded}
                  />
                  <AudienceTargetItem
                    name="all-staff"
                    count={54}
                    setSelected={setAndClose}
                    value={audience.targetName}
                    disabled={mode === 'edit'}
                    waitWithSkeleton={populationLoaded}
                  />
                  <StyledListSubheader $secondary>Speakers</StyledListSubheader>
                  <AudienceTargetItem
                    name="all-speakers"
                    count={9}
                    setSelected={setAndClose}
                    value={audience.targetName}
                    disabled={mode === 'edit'}
                    waitWithSkeleton={populationLoaded}
                  />
                </ElevatedPaper>
                <ElevatedPaper>
                  <StyledListSubheader>Course Participants</StyledListSubheader>
                  <PrimaryButton disabled style={{ margin: '1rem' }}>
                    Course Students...
                  </PrimaryButton>
                </ElevatedPaper>
              </Dialog>
              {errors.draftAudience && (
                <FormError>* This field is required</FormError>
              )}
            </Field>
          </Wrapper>
          <Wrapper>
            <Field>
              <StyledDateTimePicker
                variant="dialog"
                format="ddd, MMM DD, YYYY hh:mm a"
                margin="normal"
                label="Start publishing on"
                minDate={
                  publishOnDisabledLogic() ? new Date(0) : dayjs().toDate()
                }
                value={publishOn}
                disabled={publishOnDisabledLogic()}
                // supply name, onBlur, inputRef and onChange to rhf with modifications
                name={draftPublishOn.name}
                onBlur={draftPublishOn.onBlur}
                inputRef={draftPublishOn.ref}
                onChange={date => {
                  setPublishOn(date?.toDate() || null)
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
                <FormError>* Past date</FormError>
              )}
            </Field>
            <Field>
              <StyledDateTimePicker
                variant="dialog"
                format="ddd, MMM DD, YYYY hh:mm a"
                margin="normal"
                label="Stop publishing on"
                minDate={getMinDateForPublishEnd()}
                minDateMessage={<></>}
                value={publishEnd}
                name={draftPublishEnd.name}
                onBlur={draftPublishEnd.onBlur}
                inputRef={draftPublishEnd.ref}
                disabled={publishEndDisabledLogic()}
                onChange={date => {
                  if (dayjs().isBefore(date!)) {
                    setPublishEnd(date!.toDate())

                    setValue('draftPublishEnd', dayjs(date!.toString()), {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  } else setError('draftPublishEnd', { type: 'beforeNow' })
                }}
                autoOk
              />
              {(errors.draftPublishEnd as FieldError)?.type ===
                'afterPublishOnDate' && (
                <FormError>* Minimum 15 minute duration</FormError>
              )}
              {(errors.draftPublishEnd as FieldError)?.type === 'beforeNow' && (
                <FormError>* Past date</FormError>
              )}
            </Field>
          </Wrapper>
          <br />
          <Wrapper>
            <FormControlLabel
              label="Important"
              control={
                <Switch
                  checked={priority === 'high'}
                  onChange={() => togglePriority()}
                />
              }
            />
            <FormControlLabel
              label="Send Alert"
              control={
                <Switch checked={sendAlert} onChange={() => toggleNotify()} />
              }
            />
          </Wrapper>
          <Wrapper $alignToRight>
            <SecondaryButton onClick={goBack}>Back</SecondaryButton>
            <SecondaryButton onClick={reset}>Reset</SecondaryButton>
            <PrimaryButton type="submit">Save</PrimaryButton>
          </Wrapper>
        </form>
      </NewAnnouncementWrapper>
    </MuiPickersUtilsProvider>
  )
}

function AudienceTargetItem({
  name,
  count,
  setSelected,
  waitWithSkeleton = true,
  value,
  disabled = false
}: {
  name: AnnouncementInstanceType['audience']['targetName']
  count: number
  setSelected: (name: AnnouncementInstanceType['audience']) => void
  waitWithSkeleton?: boolean
  value: AnnouncementInstanceType['audience']['targetName']
  disabled?: boolean
}) {
  return (
    <MultilineListItem
      selected={value === name}
      button
      onClick={() => setSelected({ targetName: name, id: undefined })}
      disabled={disabled}
    >
      <AudienceSegmentName>
        {getAudienceTargetLabel({ targetName: name, id: undefined })}
      </AudienceSegmentName>
      {waitWithSkeleton ? (
        <AudienceCountChip label={count} />
      ) : (
        <Skeleton>
          <AudienceCountChip label={count} />
        </Skeleton>
      )}
    </MultilineListItem>
  )
}

const EditAnnouncement = observer(function EditAnnouncement() {
  const store = useMst()

  const announcement = store.announcements._all.find(
    announcement => announcement.id === store.view.id
  )

  const [announcementClone, setAnnouncementClone] =
    React.useState<AnnouncementInstanceType>()
  const [displayEmptyPublishOn, setDisplayEmptyPublishOn] =
    React.useState(false)

  React.useEffect(() => {
    if (announcement) setAnnouncementClone(clone(announcement))
  }, [announcement])

  function saveEdit() {
    if (announcement && announcementClone) {
      applySnapshot(announcement, getSnapshot(announcementClone))
      store.view.openAnnouncementsPage()
    }
  }

  if (!announcement)
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '1rem 0.5rem' }}>Announcement not found</div>
        <SecondaryButton onClick={() => store.view.openAnnouncementsPage()}>
          Back to Announcements
        </SecondaryButton>
      </div>
    )

  if (!announcementClone) return <div>No clone</div>

  return (
    <EditAnnouncementComponent
      mode="edit"
      save={saveEdit}
      subject={announcementClone.subject}
      setSubject={() => {}}
      setBodyText={() => {}}
      bodyText={announcementClone.bodyText}
      audience={announcementClone.audience}
      setAudience={() => {}}
      publishOn={displayEmptyPublishOn ? null : announcementClone.publishOn}
      originalPublishOn={announcementClone.publishOn}
      setPublishOn={(newPublishOn: Date | null) => {
        if (newPublishOn) {
          announcementClone.setPublishOn(newPublishOn)
          setDisplayEmptyPublishOn(false)
        } else setDisplayEmptyPublishOn(true)
      }}
      publishEnd={announcementClone.publishEnd}
      originalPublishEnd={announcementClone.publishEnd}
      setPublishEnd={announcementClone.setPublishEnd}
      priority={announcementClone.priority}
      togglePriority={() => {}}
      sendAlert={false}
      toggleNotify={() => {}}
      goBack={() => store.view.openAnnouncementsPage()}
      reset={() => {
        setAnnouncementClone(clone(announcement))
      }}
    />
  )
})

const AnnouncementDraftPage = observer(function AnnouncementDraftPage() {
  const store = useMst()

  function saveDraft(_data?: formInputs) {
    store.announcements.saveDraft()
    store.view.openAnnouncementsPage()
  }

  if (!store.announcements.editMode?.newDraft)
    return <div>Cannot create a new announcement</div>
  if (store.view.page === '/announcements/new')
    return (
      <EditAnnouncementComponent
        mode="new"
        save={saveDraft}
        subject={store.announcements.editMode.newDraft.subject}
        setSubject={(newSubject: string) =>
          store.announcements.editMode?.newDraft?.setSubject(newSubject)
        }
        setBodyText={(newBodyText: string) =>
          store.announcements.editMode?.newDraft?.setBodyText(newBodyText)
        }
        bodyText={store.announcements.editMode.newDraft.bodyText}
        audience={store.announcements.editMode.newDraft.audience}
        setAudience={(newAudience: AnnouncementInstanceType['audience']) =>
          store.announcements.editMode?.newDraft?.setAudience(newAudience)
        }
        publishOn={store.announcements.editMode.newDraft.publishOn}
        setPublishOn={(newPublishOn: Date | null) =>
          store.announcements.editMode?.newDraft?.setPublishOn(newPublishOn)
        }
        publishEnd={store.announcements.editMode.newDraft.publishEnd}
        setPublishEnd={(newDate: Date) =>
          store.announcements.editMode?.newDraft?.setPublishEnd(newDate)
        }
        priority={store.announcements.editMode.newDraft.priority}
        togglePriority={() =>
          store.announcements.editMode?.newDraft?.togglePriority()
        }
        sendAlert={store.announcements.editMode.newDraft.sendAlert}
        toggleNotify={() =>
          store.announcements.editMode?.newDraft?.toggleNotify()
        }
        goBack={() => store.view.openAnnouncementsPage()}
        reset={() => store.announcements.editMode?.clearDraft()}
      />
    )
  if (store.view.page === '/announcements/edit') return <EditAnnouncement />

  // never executed. Page is either '/announcements/new' or '/announcements/edit'
  return <></>
})

export default AnnouncementDraftPage
