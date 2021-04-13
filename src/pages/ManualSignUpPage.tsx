import * as React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Controller, useForm } from 'react-hook-form'
import * as EmailValidator from 'email-validator'
import { PasswordMeter } from 'password-meter'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import PaddedPaper from '../components/common/PaddedPaper'

import styled from 'styled-components'
import red from '@material-ui/core/colors/red'
import VisibilityIcon from '@material-ui/icons/Visibility'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import PasswordStrengthMeter from '../components/Signup/PasswordStrengthMeter'
// import { useMst } from '../models/reactHook'
// import Error from '../components/Error'
import { observer } from 'mobx-react-lite'

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
      <VisibilityIcon />
    </IconButton>
  )
}

function isPasswordStrong(password: string) {
  return new PasswordMeter().getResult(password).percent > 80
}

const InputValidationWarning = styled(Typography)`
  position: absolute;
  bottom: -12px;
  left: 2px;
  margin: 0;
  color: ${red[900]};
`

function InvalidEmailWarning() {
  return (
    <InputValidationWarning variant="body2">
      Email is not valid
    </InputValidationWarning>
  )
}

function PasswordsMismatchWarning() {
  return (
    <InputValidationWarning variant="body2">
      The passwords do not match
    </InputValidationWarning>
  )
}

const StyledEmailTextField = styled(TextField)`
  width: calc(100% - 48px);
`

// function SignupEmailField() {
//   return (
//     <StyledEmailTextField
//       variant="outlined"
//       margin="normal"
//       id="signup-email"
//       label="Email Address"
//       name="signupEmail"
//       type="email"
//       autoComplete="email"
//       autoFocus
//     />
//   )
// }

const StyledPasswordTextField = styled(TextField)`
  flex: 1;
`

function SignupPasswordField({ passwordHidden }: { passwordHidden: boolean }) {
  return (
    <StyledPasswordTextField
      variant="outlined"
      margin="normal"
      aria-describedby="password-strength-progress"
      name="signupPassword"
      label="Password"
      type={passwordHidden ? 'password' : 'text'}
      id="signup-password"
      autoComplete="current-password"
    />
  )
}

function SignupRepeatPasswordField({
  passwordHidden
}: {
  passwordHidden: boolean
}) {
  return (
    <StyledPasswordTextField
      variant="outlined"
      margin="normal"
      name="repeatPassword"
      label="Repeat Password"
      type={passwordHidden ? 'password' : 'text'}
      id="signup-repeat-password"
      autoComplete="current-password"
    />
  )
}

function ManualSignup() {
  //   const store = useMst()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    formState: { dirtyFields }
  } = useForm({
    mode: 'onTouched'
  })

  const [passwordHidden, setPasswordHidden] = React.useState(true)
  const [repeatPasswordHidden, setRepeatPasswordHidden] = React.useState(true)

  const passwordWatch = watch('signupPassword', '')

  React.useEffect(() => console.log(passwordHidden), [passwordHidden])
  return (
    <Box height="100vh" justifyContent="center" display="flex">
      <Grid container justify="center" style={{ margin: 'auto 0' }}>
        <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
          <PaddedPaper>
            <Typography component="h1" variant="h5">
              Sivananda Bahamas Guests - Sign Up
            </Typography>
            <form
              onSubmit={handleSubmit(data =>
                alert('logging in with:' + JSON.stringify(data, null, 2))
              )}
            >
              <Grid
                container
                direction="column"
                justify="space-between"
                spacing={2}
              >
                <Controller
                  name="signupEmail"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    validate: value => EmailValidator.validate(value)
                  }}
                  render={({ field }) => (
                    <StyledEmailTextField {...field} autoComplete="email" />
                  )}
                />
                {errors.signupEmail && <InvalidEmailWarning />}
                <SignupPasswordField
                  passwordHidden={passwordHidden}
                  {...register('signupPassword', {
                    required: true,
                    validate: () => isPasswordStrong(passwordWatch)
                  })}
                />
                <ShowPasswordIcon callback={setPasswordHidden} />
                {dirtyFields.signupPassword && (
                  <PasswordStrengthMeter password={passwordWatch} />
                )}
                <SignupRepeatPasswordField
                  passwordHidden={repeatPasswordHidden}
                  {...register('repeatPassword', {
                    required: true,
                    validate: value => value === passwordWatch
                  })}
                />
                <ShowPasswordIcon callback={setRepeatPasswordHidden} />
                {errors.repeatPassword && <PasswordsMismatchWarning />}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
                <Grid item>
                  {/* {loading && <p>Registering...</p>} */}
                  {/* {error && <Error error={error} />} */}
                  {/* {data && (
                    <>
                      <p>Registered... {JSON.stringify(data)}</p>
                      <p>Check your email to verify the registration.</p>
                    </>
                  )} */}
                </Grid>
              </Grid>
            </form>
          </PaddedPaper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default observer(ManualSignup)
