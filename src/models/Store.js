import { types } from 'mobx-state-tree'
import { View } from './View'
import { Preferences } from './Preferences'

export const Store = types.model('rootStore', {
  view: View,
  preferences: Preferences
})
