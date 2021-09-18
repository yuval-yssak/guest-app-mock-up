import * as React from 'react'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import { PrimaryButton } from '../components/common/Buttons'
import { useMst } from '../models/reactHook'
import { FixedSizedPaper, LoginBackground } from './LoginPage'
import { isElementInViewport } from '../components/common/isElementInViewport'

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
  const connectRef = React.createRef<HTMLButtonElement>()

  React.useEffect(() => {
    let timeoutID: NodeJS.Timeout
    if (connectRef.current && !isElementInViewport(connectRef.current))
      timeoutID = setTimeout(
        () => connectRef.current?.scrollIntoView({ behavior: 'smooth' }),
        1000
      )

    return () => clearTimeout(timeoutID)
  }, [connectRef])

  return (
    <LoginBackground>
      <FixedSizedPaper $opacity={store.preferences.darkMode ? 0.8 : undefined}>
        <WelcomeTitle align="center" variant="h2">
          Welcome
        </WelcomeTitle>
        <Typography align="center" variant="h4">
          to
        </Typography>
        <AppLogo>Sivananda Bahamas App</AppLogo>
        <PrimaryButton
          onClick={() => store.view.openLoginPage()}
          ref={connectRef}
          // inputRef={connectRef}
        >
          Connect with us
        </PrimaryButton>
      </FixedSizedPaper>
    </LoginBackground>
  )
}

export default LoginCoverPage
