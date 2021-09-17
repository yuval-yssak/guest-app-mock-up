import * as React from 'react'

import Button from '@material-ui/core/Button'
import { useForm } from 'react-hook-form'
import * as EmailValidator from 'email-validator'
import { PasswordMeter } from 'password-meter'
import Link from '@material-ui/core/Link'

import styled from 'styled-components'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Alert from '@material-ui/core/Alert'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import PasswordStrengthMeter from '../components/Signup/PasswordStrengthMeter'
import { observer } from 'mobx-react-lite'
import { FixedSizedPaper, Form, LoginBackground } from './LoginPage'
import {
  Field,
  FormError,
  FormTextField,
  Wrapper
} from '../components/common/Forms'
import { PrimaryButton } from '../components/common/Buttons'

const StyledVisibilityIcon = styled(VisibilityIcon)`
  transform: translateY(-0.2rem);
`

const SignupProgressReport = styled.div.attrs({ className: 'progress-report' })`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
`

// IconButton which enables showing the password for improved accessibility
function ShowPasswordIcon({
  callback
}: {
  callback: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <IconButton
      aria-label="show password"
      // show when icon is touched
      onTouchStart={() => {
        callback(false)
      }}
      // hide once the icon stops being touched
      onTouchEnd={() => {
        callback(true)
      }}
      onMouseDown={() => {
        callback(false)
      }}
      onMouseUp={() => {
        callback(true)
      }}
      onKeyDown={() => {
        callback(false)
      }}
      onKeyUp={() => {
        callback(true)
      }}
      onBlur={() => {
        callback(true)
      }}
    >
      <StyledVisibilityIcon />
    </IconButton>
  )
}

function isPasswordStrong(password: string) {
  return new PasswordMeter().getResult(password).percent > 80
}

type FormInputs = {
  signupEmail: string
  signupPassword: string
  repeatPassword: string
}

function ManualSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
    reset,
    formState: { dirtyFields, submitCount }
  } = useForm<FormInputs>({
    mode: 'onTouched'
  })

  const [state, setState] = React.useState<
    '' | 'processing' | 'processed' | 'failed'
  >('')
  function onSubmit(data: FormInputs) {
    setState('processing')
  }

  React.useEffect(() => {
    let timeoutID: NodeJS.Timeout

    if (state === 'processing')
      timeoutID = setTimeout(
        () => setState(Math.random() > 0.5 ? 'processed' : 'failed'),
        3000
      )

    return () => clearTimeout(timeoutID)
  }, [state])

  const [passwordHidden, setPasswordHidden] = React.useState(true)
  const [repeatPasswordHidden, setRepeatPasswordHidden] = React.useState(true)

  const passwordWatch = watch('signupPassword', '')

  const email = register('signupEmail', {
    required: true,
    validate: value => EmailValidator.validate(value)
  })

  const password = register('signupPassword', {
    required: true,
    validate: () => isPasswordStrong(passwordWatch)
  })

  const repeatPassword = register('repeatPassword', {
    required: true,
    validate: value => value === passwordWatch
  })

  return (
    <LoginBackground>
      <FixedSizedPaper>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Wrapper bottomSpacing={!!errors.signupEmail}>
            <Field>
              <FormTextField
                variant="outlined"
                disabled={!!state}
                fullWidth
                size="small"
                id="email"
                label="Email"
                autoComplete="email"
                name={email.name}
                onChange={email.onChange}
                onBlur={email.onBlur}
                inputRef={email.ref}
              />
              {errors.signupEmail && <FormError>Email is not valid</FormError>}
            </Field>
          </Wrapper>
          <Wrapper bottomSpacing={!!dirtyFields.signupPassword}>
            <Field>
              <Tooltip
                title={
                  submitCount && errors.signupPassword
                    ? 'Choose a stronger password'
                    : ''
                }
              >
                <FormTextField
                  aria-describedby="password-strength-progress"
                  variant="outlined"
                  disabled={!!state}
                  fullWidth
                  size="small"
                  label="Password"
                  type={passwordHidden ? 'password' : 'text'}
                  id="password"
                  autoComplete="current-password"
                  name={password.name}
                  onChange={e => {
                    password.onChange(e)
                    // trigger validation on repeatPassword field
                    setImmediate(() => trigger('repeatPassword'))
                  }}
                  onBlur={password.onBlur}
                  inputRef={password.ref}
                />
              </Tooltip>
              {dirtyFields.signupPassword && (
                <PasswordStrengthMeter password={passwordWatch} />
              )}
            </Field>
            <ShowPasswordIcon callback={setPasswordHidden} />
          </Wrapper>
          <Wrapper bottomSpacing={!!errors.repeatPassword}>
            <Field>
              <FormTextField
                variant="outlined"
                disabled={!!state}
                fullWidth
                size="small"
                label="Repeat Password"
                type={repeatPasswordHidden ? 'password' : 'text'}
                id="signup-repeat-password"
                autoComplete="current-password"
                name={repeatPassword.name}
                onChange={e => {
                  repeatPassword.onChange(e)
                  setValue('repeatPassword', e.target.value)
                }}
                onBlur={repeatPassword.onBlur}
                inputRef={repeatPassword.ref}
              />
              {errors.repeatPassword && (
                <FormError>
                  {errors.repeatPassword.type === 'required'
                    ? 'Empty Password'
                    : 'The passwords do not match'}
                </FormError>
              )}
            </Field>
            <ShowPasswordIcon callback={setRepeatPasswordHidden} />
          </Wrapper>
          <Button
            disabled={!!state}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginBottom: '1rem' }}
          >
            Sign Up
          </Button>
          <PrimaryButton disabled={!!state} type="submit">
            Sign Up
          </PrimaryButton>
          <Typography variant="caption">
            By joining, you agree to our{' '}
            <Link href="https://sivanandabahamas.org/terms-conditions/">
              Terms and Privacy Policy
            </Link>
          </Typography>
        </Form>
        <SignupProgressReport>
          {state === 'processing' && (
            <>
              <CircularProgress />
              <Typography>Processing your registration...</Typography>
            </>
          )}
          {state === 'processed' && (
            <Alert severity="success">
              Great, please check your email to verify the registration.
            </Alert>
          )}
          {state === 'failed' && (
            <Alert severity="error">
              Apologies, we could not register you at this time.
            </Alert>
          )}
          {['processed', 'failed'].some(a => a === state) && (
            <>
              <button
                style={{ position: 'absolute', bottom: 0, left: '1rem' }}
                onClick={() => setState('processing')}
              >
                Run simulation again...
              </button>
              <button
                style={{ position: 'absolute', bottom: 0, right: '1rem' }}
                onClick={() => {
                  setState('')
                  reset()
                }}
              >
                Reset Form
              </button>
            </>
          )}
        </SignupProgressReport>
      </FixedSizedPaper>
    </LoginBackground>
  )
}

export default observer(ManualSignup)
