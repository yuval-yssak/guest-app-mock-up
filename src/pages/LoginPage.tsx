import * as React from 'react'
import { useMst } from '../models/reactHook'
import Typography from '@material-ui/core/Typography'

import ButtonBase from '@material-ui/core/ButtonBase'
import Link from '@material-ui/core/Link'
import { useForm } from 'react-hook-form'
import * as EmailValidator from 'email-validator'
import PaddedPaper from '../components/common/PaddedPaper'
import {
  Field,
  Wrapper,
  FormTextField,
  FormError
} from '../components/common/Forms'
import styled from 'styled-components'
import { rgba } from 'polished'
import { PrimaryButton } from '../components/common/Buttons'
import { applySnapshot } from 'mobx-state-tree'
import defaultStore from '../defaultStore'

export const LoginBackground = styled.div`
  &:before {
    content: '';
    background-image: url('./images/login-page-beach-hands-up.jpg');
    background-position: 50% 40%;
    background-size: cover;
    position: fixed;
    height: 100vh;
    width: 100vw;
  }
  position: relative;
`

export const FixedSizedPaper = styled(PaddedPaper).attrs({ elevation: 2 })`
  display: flex;
  flex-direction: column;
  height: 26rem;
  left: 15%;
  position: relative;
  top: 10%;
  width: 21rem;

  @media (max-width: 63em) {
    left: max(0px, calc(15% - (63em - 100vw) / 2));
  }

  @media (max-height: 31.2em) {
    top: max(0px, calc(10% - (31.2em - 100vh) / 2));
    left: 0;
  }

  @media (max-width: 42em) {
    left: 0;
    min-height: 100vh;
    top: 0;
    width: 100vw;
    padding: max(1rem, calc((100vw - 20rem) / 2));
  }
`

const GoogleIcon = styled.img.attrs({
  src: 'https://developers.google.com/identity/images/g-logo.png',
  alt: 'google-sign-in'
})`
  height: 1rem;
`

const FacebookIcon = styled.img.attrs({
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/240px-Facebook_Logo_%282019%29.png',
  alt: 'facebooks-sign-in'
})`
  height: 1rem;
`

const OAuthButton = styled(ButtonBase).attrs({ focusRipple: true })`
  && {
    border: 1px solid ${({ theme }) => rgba(theme.palette.primary.main, 0.5)};

    background-color: ${({ theme: { palette }, disabled }) =>
      disabled && palette.grey[palette.mode === 'dark' ? '600' : '200']};
    color: ${({ theme: { palette }, disabled }) =>
      disabled && palette.grey[palette.mode === 'dark' ? '500' : '500']};

    &:hover {
      background-color: ${({ theme }) =>
        rgba(theme.palette.primary.main, 0.04)};
      border: 1px solid ${({ theme }) => theme.palette.primary.main};
    }

    border-radius: 0.25rem;
    display: flex;
    font-family: inherit;
    height: 2rem;
    margin-bottom: 0.3rem;
    padding: 0.2rem 0.5rem;
    text-align: inherit;
    transition: background-color 0.25s, border-color 0.25s;
  }
`

const OAuthLabel = styled.div`
  flex: 1;
  font-weight: 300;
  padding-left: 0.8rem;
  letter-spacing: 0.01rem;

  & strong {
    font-weight: 400;
  }
`

const DividerLines = styled.div`
  align-items: center;
  display: flex;
  margin: 0.9rem 0;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background-color: ${({ theme: { palette } }) => palette.grey['400']};
    flex: 1;
  }
`

const RoundOr = styled.div`
  background-color: ${({ theme: { palette } }) => palette.grey['400']};
  border-radius: 50%;
  color: ${({ theme: { palette } }) => palette.grey['100']};
  text-transform: uppercase;
  padding: 0.4rem;
  font-size: 0.6rem;
  font-weight: 500;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`

type LoginFormInput = { email: string; password: string }

function ManualSignIn() {
  const store = useMst()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInput>({
    mode: 'onTouched'
  })

  function onSubmit(data: LoginFormInput) {
    // simulate logging in
    applySnapshot(store, {
      ...defaultStore,
      view: { id: '', page: '/' },
      status: store.status
    })
  }

  const email = register('email', {
    required: true,
    validate: value => EmailValidator.validate(value)
  })

  const password = register('password', { required: true })

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Wrapper bottomSpacing={!!errors.email}>
        <Field>
          <FormTextField
            variant="outlined"
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
          {errors.email && <FormError>Email not valid</FormError>}
        </Field>
      </Wrapper>
      <Wrapper bottomSpacing={!!errors.password}>
        <Field>
          <FormTextField
            variant="outlined"
            fullWidth
            size="small"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            name={password.name}
            onChange={password.onChange}
            onBlur={password.onBlur}
            inputRef={password.ref}
          />
          {errors.password && <FormError>Password missing</FormError>}
        </Field>
      </Wrapper>
      <PrimaryButton type="submit">Sign In</PrimaryButton>
      <Typography align="center">
        <Link href="#" variant="body2" color="secondary.dark">
          Forgot password?
        </Link>
      </Typography>
    </Form>
  )
}

const Divider = () => (
  <DividerLines>
    <RoundOr>or</RoundOr>
  </DividerLines>
)

function Login() {
  const store = useMst()

  return (
    <LoginBackground>
      <FixedSizedPaper>
        <OAuthButton
          onClick={() => {
            alert('Logging in with Google')
          }}
        >
          <GoogleIcon />
          <OAuthLabel>
            Sign in with <strong>Google</strong>
          </OAuthLabel>
        </OAuthButton>
        <OAuthButton disabled>
          <FacebookIcon />
          <OAuthLabel>
            Sign in with <strong>Facebook</strong>
          </OAuthLabel>
        </OAuthButton>
        <Divider />
        <ManualSignIn />
        <Divider />
        <PrimaryButton
          onClick={() => {
            store.view.openManualSignupPage()
          }}
        >
          Sign Up
        </PrimaryButton>
      </FixedSizedPaper>
    </LoginBackground>
  )
}

export default Login
