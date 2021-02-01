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
    unread: types.array(AnnouncementModel),
    read: types.array(AnnouncementModel)
  })
  .views(self => ({
    announcementById(id) {
      return self.unread.concat(self.read).find(a => a.id === id)
    }
  }))
  .actions(self => ({
    add(announcement) {
      if (announcement.status === 'read') self.read.push(announcement)
      else self.unread.push(announcement)
    },
    remove(id) {
      const unreadIndex = self.unread.findIndex(a => a.id === id)
      if (unreadIndex > -1) self.unread.splice(unreadIndex, 1)

      const readIndex = self.read.findIndex(a => a.id === id)
      if (readIndex > -1) self.read.splice(readIndex, 1)
    }
  }))

export const Announcements = types.optional(AnnouncementsModel, {})
