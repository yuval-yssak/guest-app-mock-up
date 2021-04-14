import { types } from 'mobx-state-tree'

export const StatusModel = types
  .model('StatusModel', {
    online: types.optional(types.boolean, navigator.onLine)
  })
  .actions(self => ({
    setOnline() {
      self.online = true
    },
    setOffline() {
      self.online = false
    }
  }))
