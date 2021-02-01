import { types } from 'mobx-state-tree'
import { View } from './View'
import { Preferences } from './Preferences'
import { Announcements } from './Announcements'

export const Store = types.model('rootStore', {
  view: View,
  preferences: Preferences,
  announcements: Announcements
})
