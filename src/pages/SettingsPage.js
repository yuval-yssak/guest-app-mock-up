import React from 'react'

import Switch from '../components/Switch'

import PageMainPaper from '../components/PageMainPaper'

export default function SettingsPage({ darkTheme, setDarkTheme }) {
  return (
    <PageMainPaper role="article" elavation={2}>
      <Switch
        darkTheme={darkTheme}
        onThemeChange={() => setDarkTheme(!darkTheme)}
      />
    </PageMainPaper>
  )
}
