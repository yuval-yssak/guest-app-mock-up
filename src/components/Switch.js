import React from 'react'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

export default function Switches({ darkTheme, onThemeChange }) {
  console.log('darktheme', darkTheme)
  return (
    <div>
      <Switch
        checked={darkTheme}
        onChange={() => onThemeChange()}
        name="dark-mode-switch"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <Typography component="label">Dark Mode</Typography>
    </div>
  )
}
