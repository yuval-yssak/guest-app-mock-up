import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { PrimaryButton } from '../components/common/Buttons'
import { useMst } from '../models/reactHook'
import { FixedSizedPaper, LoginBackground } from './LoginPage'

const WelcomeTitle = styled(Typography)`
  && {
    margin-bottom: 0.4rem;
  }
`

const AppLogo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  font-family: cursive;
  font-size: 2.7rem;
  justify-content: center;
  text-align: center;
`

function LoginCoverPage() {
  const store = useMst()

  return (
    <LoginBackground>
      <FixedSizedPaper $opacity={store.preferences.darkMode ? 0.5 : undefined}>
        <WelcomeTitle align="center" variant="h2">
          Welcome
        </WelcomeTitle>
        <Typography align="center" variant="h4">
          to
        </Typography>
        <AppLogo>Sivananda Bahamas App</AppLogo>
        <PrimaryButton onClick={() => store.view.openLoginPage()}>
          Connect with us
        </PrimaryButton>
      </FixedSizedPaper>
    </LoginBackground>
  )
}

export default LoginCoverPage
