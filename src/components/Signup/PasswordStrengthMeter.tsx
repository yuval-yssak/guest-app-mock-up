import React from 'react'

import styled from 'styled-components'
import { PasswordMeter } from 'password-meter'

import LinearProgress from '@material-ui/core/LinearProgress'
import red from '@material-ui/core/colors/red'
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'
import Typography from '@material-ui/core/Typography'

const StyledPasswordMeterDiv = styled.div<{ value: number }>`
  align-items: center;
  bottom: -0.9rem;
  column-gap: 0.4rem;
  display: flex;
  justify-content: space-between;
  position: absolute;
  width: 100%;

  & p {
    color: ${({ value }) =>
      value < 30 ? red[600] : value < 80 ? amber[900] : green[800]};
    margin: 0;
    text-align: center;
    width: max-content;
  }
`
const LinearProgressWithStages = styled(LinearProgress)<{ value: number }>`
  flex: 1;

  & div {
    background-color: ${props =>
      props.value < 30 ? red[600] : props.value < 80 ? amber[900] : green[800]};
  }
`

function PasswordStrengthMeter({ password }: { password: string }) {
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
