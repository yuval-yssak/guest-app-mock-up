import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { observer } from 'mobx-react-lite'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Skeleton from '@material-ui/core/Skeleton'
import Input from '@material-ui/core/Input'
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
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import DateTimePicker from '@material-ui/lab/DateTimePicker'
import AdapterDayjs from '@material-ui/lab/AdapterDayjs'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import styled from 'styled-components'
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
  flex: 1;
`

// give room for error message
const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 0.8rem;
  }
`

const DateTimeTextField = styled(TextField)`
  && {
    min-width: 15rem;
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
  margin-top: 1rem;
`

// A line wrapper in a form
const Wrapper = styled.div.attrs({ className: 'line-wrapper' })<{
  $alignToRight?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;

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

const AudienceInputLabel = styled(InputLabel)`
  width: 100%;
`

const MultilineListItem = styled(ListItem)<{
  selected: boolean
}>`
  && {
    white-space: normal;
    display: flex;
    column-gap: 0.5rem;
    background-color: ${({ selected, theme: { palette } }) =>
      selected
        ? palette.mode === 'light'
          ? palette.grey['200']
          : palette.grey['800']
        : 'inherit'};
  }

  &:hover {
    background-color: ${({ theme: { palette } }) =>
      palette.mode === 'light' ? palette.grey['200'] : palette.grey['800']};
  }
`

const ElevatedPaper = styled(Paper).attrs({ elevation: 2 })`
  margin: 1rem;
  padding: 1rem;
`

const AudienceSegmentName = styled(Typography).attrs({ variant: 'body1' })`
  flex: 1;
`

const AudienceCountChip = styled(Chip).attrs({
  color: 'primary',
  variant: 'outlined'
})``

const PrimaryButtonWithMargin = styled(PrimaryButton)`
  && {
    margin: 1rem;
    margin-top: 0;
  }
`

type formInputs = {
  draftSubject: string
  draftBodyText: string
  draftAudience: string
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
    clearErrors,
    trigger
  } = useForm<formInputs>({ mode: 'onTouched' })

  const store = useMst()

  const [populationLoaded, setPopulationLoaded] = React.useState(false)

  // emulate loading data delay
  React.useEffect(() => {
    setTimeout(() => setPopulationLoaded(true), 4500)
  }, [])

  // update the form with the prop values
  // (otherwise each field has to be manually touched for verification)
  React.useEffect(() => {
    setValue('draftSubject', subject)
    setValue('draftBodyText', bodyText)
    publishOn && setValue('draftPublishOn', dayjs(publishOn))
    setValue('draftPublishEnd', dayjs(publishEnd))
    setValue('draftAudience', getAudienceTargetLabel(audience))
  }, [setValue, bodyText, publishOn, publishEnd, subject, audience])

  const [audienceDialogOpen, setAudienceDialogOpen] = React.useState(false)

  const shouldBeAbleToArchive = mode === 'edit' && dayjs().isBefore(publishEnd)
  const shouldBeAbleToDuplicate = mode === 'edit'

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
      beforeNow: date => {
        if (publishOnDisabledLogic()) return true
        else return date ? dayjs().isBefore(dayjs(date.toString())) : true
      }
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

  const setAndClose = (value: AnnouncementInstanceType['audience']) => {
    if (value) {
      setAudience(value)
      setAudienceDialogOpen(false)
      clearErrors('draftAudience')
    }
  }

  type AudienceTarget = {
    name: AnnouncementInstanceType['audience']['targetName']
    count: number
    waitWithSkeleton?: boolean
  }
  const audienceTargets: AudienceTarget[] = [
    { name: 'all-residents-and-visitors', count: 270 },
    { name: 'all-residents', count: 259 },
    { name: 'all-residents-guests', count: 184 },
    {
      name: 'all-residents-guests-no-children',
      count: 182,
      waitWithSkeleton: populationLoaded
    },
    {
      name: 'all-staff-karma-yogis',
      count: 122,
      waitWithSkeleton: populationLoaded
    },
    { name: 'all-karma-yogis', count: 68, waitWithSkeleton: populationLoaded },
    { name: 'all-staff', count: 54, waitWithSkeleton: populationLoaded },
    {
      name: 'all-speakers',
      count: 9,
      waitWithSkeleton: populationLoaded
    }
  ]

  function renderAudienceTargetItem(targetItem: AudienceTarget) {
    return (
      <AudienceTargetItem
        name={targetItem.name}
        count={targetItem.count}
        setSelected={setAndClose}
        value={audience.targetName}
        disabled={mode === 'edit'}
        waitWithSkeleton={
          targetItem.waitWithSkeleton === undefined
            ? true
            : targetItem.waitWithSkeleton
        }
      />
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NewAnnouncementWrapper>
        <form onSubmit={handleSubmit(save)}>
          <Wrapper>
            <Tooltip title="Maximum 80 characters">
              <Field>
                <StyledTextField
                  label="Subject"
                  placeholder="Enter a one-line subject here"
                  fullWidth
                  value={subject}
                  disabled={mode === 'edit'}
                  name={draftSubject.name}
                  onBlur={draftSubject.onBlur}
                  inputRef={draftSubject.ref}
                  onChange={e => {
                    setSubject(e.target.value) // update to store
                    draftSubject.onChange(e) // register change in the form hook
                  }}
                  autoComplete="off"
                />
                {errors.draftSubject?.type === 'required' && (
                  <FormError>* This field is required</FormError>
                )}
                {errors.draftSubject?.type === 'maxLength' && (
                  <FormError>* Exceeds 80 characters limit</FormError>
                )}
              </Field>
            </Tooltip>
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
                disabled={mode === 'edit'}
                name={draftBodyText.name}
                onBlur={draftBodyText.onBlur}
                inputRef={draftBodyText.ref}
                onChange={e => {
                  setBodyText(e.target.value) // update to store
                  draftBodyText.onChange(e) // register change in the form hook
                }}
                autoComplete="off"
              />
              {errors.draftBodyText && (
                <FormError>* This field is required</FormError>
              )}
            </Field>
          </Wrapper>
          <Wrapper>
            <Field>
              <AudienceInputLabel>
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
                  autoComplete="off"
                />
              </AudienceInputLabel>
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
                  {audienceTargets.slice(0, 1).map(renderAudienceTargetItem)}
                </ElevatedPaper>
                <ElevatedPaper>
                  <StyledListSubheader>Resident Audience</StyledListSubheader>
                  <List>
                    {audienceTargets.slice(1, 2).map(renderAudienceTargetItem)}
                    <StyledListSubheader $secondary>
                      Resident Guests
                    </StyledListSubheader>
                    {audienceTargets.slice(2, 4).map(renderAudienceTargetItem)}
                  </List>
                  <StyledListSubheader $secondary>
                    Resident Staff/Karma Yogis
                  </StyledListSubheader>
                  {audienceTargets.slice(4, 7).map(renderAudienceTargetItem)}
                  <StyledListSubheader $secondary>Speakers</StyledListSubheader>
                  {audienceTargets.slice(7, 8).map(renderAudienceTargetItem)}
                </ElevatedPaper>
                <ElevatedPaper>
                  <StyledListSubheader>Course Participants</StyledListSubheader>
                  <PrimaryButtonWithMargin disabled>
                    Course Students...
                  </PrimaryButtonWithMargin>
                </ElevatedPaper>
              </Dialog>
              {errors.draftAudience && (
                <FormError>* This field is required</FormError>
              )}
            </Field>
          </Wrapper>
          <Wrapper>
            <Field>
              <Tooltip title="Choose a date or keep empty to start publishing now">
                <DateTimePicker
                  inputFormat="MM/DD/YYYY HH:mm a"
                  label="Start publishing on"
                  minDateTime={
                    publishOnDisabledLogic() ? new Date(0) : dayjs().toDate()
                  }
                  value={(publishOn && dayjs(publishOn)) || null}
                  disabled={publishOnDisabledLogic()}
                  // supply name, onBlur, inputRef and onChange to rhf with modifications
                  renderInput={params => (
                    <TextField
                      name={draftPublishOn.name}
                      onBlur={draftPublishOn.onBlur}
                      autoComplete="off"
                      inputRef={draftPublishOn.ref}
                      {...params}
                      helperText={
                        errors.draftPublishOn
                          ? ''
                          : 'Keep blank to start publishing now.'
                      }
                    />
                  )}
                  onChange={date => {
                    setPublishOn(date?.toDate() || null)
                    setValue('draftPublishOn', date, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                    // trigger validation on publishEnd field
                    trigger('draftPublishEnd')
                  }}
                  clearable
                />
              </Tooltip>
              {(errors.draftPublishOn as FieldError)?.type === 'beforeNow' && (
                <FormError>* Past date</FormError>
              )}
            </Field>
            <Field>
              <DateTimePicker
                inputFormat="MM/DD/YYYY HH:mm a"
                label="Stop publishing on"
                minDateTime={getMinDateForPublishEnd()}
                value={dayjs(publishEnd)}
                renderInput={params => (
                  <DateTimeTextField
                    name={draftPublishEnd.name}
                    onBlur={draftPublishEnd.onBlur}
                    inputRef={draftPublishEnd.ref}
                    {...params}
                    helperText=""
                    autoComplete="off"
                  />
                )}
                disabled={publishEndDisabledLogic()}
                onChange={date => {
                  if (!date) {
                    console.error('publish end changed to null')
                    return
                  } // the picker is not clearable, so there will always be a date.

                  // the assumption is that date has to be non null
                  // since the picker is not clearable
                  if (dayjs().isBefore(date!)) {
                    setPublishEnd(date.toDate())

                    setValue('draftPublishEnd', date, {
                      shouldValidate: true,
                      shouldDirty: true
                    })
                  } else setError('draftPublishEnd', { type: 'beforeNow' })
                }}
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
            <Tooltip title="High importance is for safety & health concerns only">
              <FormControlLabel
                label="Important"
                control={
                  <Switch
                    checked={priority === 'high'}
                    onChange={() => togglePriority()}
                  />
                }
              />
            </Tooltip>
            <Tooltip title="Send alert will issue an email and a push notification for the users who have registered to receive notifications in any of their devices. Push notifications currently do not work at all on Apple devices, and email notifications are subject to user preferences.">
              <FormControlLabel
                label="Send Alert"
                control={
                  <>
                    <Switch
                      checked={sendAlert}
                      onChange={() => toggleNotify()}
                    />
                  </>
                }
              />
            </Tooltip>
          </Wrapper>
          <Wrapper $alignToRight>
            <Tooltip title="Discard changes">
              <SecondaryButton
                onClick={() => {
                  if (window.history.length) window.history.back()
                  else store.view.openAnnouncementsPage()
                }}
              >
                Back
              </SecondaryButton>
            </Tooltip>
            <SecondaryButton onClick={reset}>
              {mode === 'edit' ? `Reset` : `Clear`}
            </SecondaryButton>
            {shouldBeAbleToArchive && (
              // todo: implement archiving
              <SecondaryButton>Archive</SecondaryButton>
            )}
            {shouldBeAbleToDuplicate && (
              <SecondaryButton
                onClick={() => {
                  const currentDraftSnapshot = getSnapshot(
                    store.announcements.editMode!.newDraft!
                  )
                  store.view.openAnnouncementsNewDraftPage()
                  if (
                    currentDraftSnapshot?.subject ||
                    currentDraftSnapshot?.bodyText
                  ) {
                    setImmediate(() =>
                      alert(
                        'You are currently editing a draft. Reset the draft first if you want to duplicate an archived announcement.'
                      )
                    )
                  } else if (store.announcements.editMode) {
                    store.announcements.editMode.clearDraft()
                    const newDraft = store.announcements.editMode.newDraft!
                    newDraft.setSubject(subject)
                    newDraft.setBodyText(bodyText)
                    newDraft.setAudience(audience)
                    if (priority === 'high') newDraft.togglePriority()
                    if (sendAlert) newDraft.toggleNotify()
                  }
                }}
              >
                Duplicate
              </SecondaryButton>
            )}
            <PrimaryButton type="submit">Save</PrimaryButton>
          </Wrapper>
        </form>
      </NewAnnouncementWrapper>
    </LocalizationProvider>
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
      as="div"
      color="transparent"
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
      originalPublishOn={announcement.publishOn}
      setPublishOn={(newPublishOn: Date | null) => {
        if (newPublishOn) {
          announcementClone.setPublishOn(newPublishOn)
          setDisplayEmptyPublishOn(false)
        } else setDisplayEmptyPublishOn(true)
      }}
      publishEnd={announcementClone.publishEnd}
      originalPublishEnd={announcement.publishEnd}
      setPublishEnd={announcementClone.setPublishEnd}
      priority={announcementClone.priority}
      togglePriority={() => {}}
      sendAlert={false}
      toggleNotify={() => {}}
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
        reset={() => store.announcements.editMode?.clearDraft()}
      />
    )
  if (store.view.page === '/announcements/edit') return <EditAnnouncement />

  // never executed. Page is either '/announcements/new' or '/announcements/edit'
  return <></>
})

export default AnnouncementDraftPage
