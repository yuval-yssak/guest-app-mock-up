import { types } from 'mobx-state-tree'

const PreferencesModel = types
  .model('Preferences', {
    darkMode: types.boolean
  })
  .actions(self => ({
    toggleDarkMode(dark) {
      self.darkMode = !self.darkMode
    }
  }))

export const Preferences = types.optional(PreferencesModel, { darkMode: false })
