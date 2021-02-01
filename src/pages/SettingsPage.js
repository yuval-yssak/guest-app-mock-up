import React from 'react'
import PageMainPaper from '../components/PageMainPaper'
import DarkModeSwitch from '../components/DarkModeSwitch'

export default function SettingsPage() {
  return (
    <PageMainPaper role="article" elavation={2}>
      <DarkModeSwitch />
    </PageMainPaper>
  )
}
