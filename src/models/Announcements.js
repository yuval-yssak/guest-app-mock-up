import { types, getParent, clone } from 'mobx-state-tree'

const AnnouncementModel = types
  .model('Announcement', {
    id: types.identifier,
    summary: types.string,
    details: types.string,
    timestamp: types.Date,
    status: types.union(types.literal('read'), types.literal('unread'))
  })
  .actions(self => ({
    toggle() {
      self.status = self.status === 'read' ? 'unread' : 'read'
      const cloned = clone(self)
      const parent = getParent(self, 2)

      parent.remove(self.id)
      parent.add(cloned)
    }
  }))
const AnnouncementsModel = types
  .model('Announcements', {
    all: types.array(AnnouncementModel)
  })
  .views(self => ({
    announcementById(id) {
      return self.all.find(a => a.id === id)
    },
    get unread() {
      return self.all.filter(a => a.status === 'unread')
    },
    get read() {
      return self.all.filter(a => a.status === 'read')
    }
  }))
  .actions(self => ({
    add(announcement) {
      self.all.push(announcement)
    },
    remove(id) {
      const index = self.all.findIndex(a => a.id === id)
      if (index > -1) self.all.splice(index, 1)
    }
  }))

export const Announcements = types.optional(AnnouncementsModel, {})
