import React from 'react'
import { observer } from 'mobx-react-lite'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { useMst } from '../models/reactHook'

function DarkModeSwitch({ className }: { className?: string }) {
  const { preferences } = useMst()

  return (
    <>
      <FormControlLabel
        className={className}
        control={
          <Switch
            checked={preferences.darkMode}
            onChange={() => preferences.toggleDarkMode()}
            name="dark-mode-switch"
          />
        }
        label="Dark Mode"
      />
      {/* <Typography component="label">Dark Mode</Typography> */}
    </>
  )
}

export default observer(DarkModeSwitch)
