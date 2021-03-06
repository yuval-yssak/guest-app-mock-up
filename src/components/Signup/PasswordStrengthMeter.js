import * as React from 'react'

import styled from 'styled-components'
import { PasswordMeter } from 'password-meter'

import LinearProgress from '@material-ui/core/LinearProgress'
import red from '@material-ui/core/colors/red'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import Typography from '@material-ui/core/Typography'

const StyledPasswordMeterDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: -14px;
  width: calc(100% - 48px);

  & p {
    flex: 2;
    text-align: center;
    margin: 0;
    color: ${props =>
      props.value < 30 ? red[600] : props.value < 80 ? amber[900] : green[800]};
  }
`
const LinearProgressWithStages = styled(LinearProgress)`
  width: 80%;

  & div {
    background-color: ${props =>
      props.value < 30 ? red[600] : props.value < 80 ? amber[900] : green[800]};
  }
`

function PasswordStrengthMeter({ password }) {
  const result = new PasswordMeter().getResult(password)

  return (
    <StyledPasswordMeterDiv value={result.percent}>
      <LinearProgressWithStages
        id="password-strength-progress"
        variant="determinate"
        value={result.percent}
      />
      <Typography variant="body2" component="p">
        {result.status === 'veryStrong'
          ? 'very strong'
          : result.status === 'veryWeak'
          ? 'very weak'
          : result.status}
      </Typography>
    </StyledPasswordMeterDiv>
  )
}

export default PasswordStrengthMeter
