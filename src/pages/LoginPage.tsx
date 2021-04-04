import * as React from 'react'
import { useMst } from '../models/reactHook'
import GoogleLogin from '../components/GoogleLogin'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import { useForm } from 'react-hook-form'
import * as EmailValidator from 'email-validator'
import PaddedPaper from '../components/common/PaddedPaper'

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

function ManualSignIn() {
  const { register, handleSubmit, errors } = useForm({
    mode: 'onChange'
  })

  const classes = useStyles()
  function onSubmit(data: { email: string; password: string }) {
    console.log('submitting', data)
  }

  const store = useMst()

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign in manually
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          inputRef={register({
            required: true,
            validate: value => EmailValidator.validate(value)
          })}
        />
        {errors.email && <p>error: email is not valid</p>}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          style={{ marginBottom: '0' }}
          inputRef={register({ required: true })}
        />
        {errors.password && <p>error: {errors.password.message}</p>}
        <Typography align="left" style={{ marginLeft: '5px' }}>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Typography
          style={{ padding: '20px 0 30px' }}
          variant="body2"
          component="p"
        >
          <Link
            component="button"
            onClick={() => {
              store.view.openManualSignupPage()
            }}
          >
            {"Don't have an account? Sign Up"}
          </Link>
        </Typography>
      </form>
    </>
  )
}

function Login() {
  return (
    <>
      <Box height="100vh" justifyContent="center" display="flex">
        <Grid container justify="center" style={{ margin: 'auto 0' }}>
          <Grid item xs={12} sm={8} md={6} lg={4} xl={3}>
            <PaddedPaper>
              <Typography variant="body1" paragraph>
                Join our community
              </Typography>
              <GoogleLogin onClick={() => {}} />
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>or</div>
              <ManualSignIn />
              <Typography variant="caption">
                By joining, you agree to our{' '}
                <Link href="https://sivanandabahamas.org/terms-conditions/">
                  Terms and Privacy Policy
                </Link>
              </Typography>
            </PaddedPaper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Login
