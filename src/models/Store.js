import { types } from 'mobx-state-tree'
import { View } from './View'
import { Preferences } from './Preferences'
import { Announcements } from './Announcements'
import { Chat } from './Chat'
import { LoggedInUser } from './LoggedInUser'

export const Store = types.model('rootStore', {
  view: View,
  preferences: Preferences,
  announcements: Announcements,
  chat: Chat,
  loggedInUser: types.maybeNull(LoggedInUser)
})
