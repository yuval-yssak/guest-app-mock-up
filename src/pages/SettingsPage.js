import React from 'react'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'

import { useMst } from '../models/reactHook'
import PageMainPaper from '../components/PageMainPaper'

export default function SettingsPage() {
  const { preferences } = useMst()
  return (
    <PageMainPaper role="article" elavation={2}>
      <Switch
        checked={preferences.darkMode}
        onChange={() => preferences.toggleDarkMode()}
        name="dark-mode-switch"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      <Typography component="label">Dark Mode</Typography>
    </PageMainPaper>
  )
}
