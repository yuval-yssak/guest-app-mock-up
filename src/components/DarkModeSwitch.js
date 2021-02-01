import React from 'react'
import { observer } from 'mobx-react-lite'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import { useMst } from '../models/reactHook'

function DarkModeSwitch() {
  const { preferences } = useMst()

  return (
    <>
      <Switch
        checked={preferences.darkMode}
        onChange={() => preferences.toggleDarkMode()}
        name="dark-mode-switch"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <Typography component="label">Dark Mode</Typography>
    </>
  )
}

export default observer(DarkModeSwitch)
