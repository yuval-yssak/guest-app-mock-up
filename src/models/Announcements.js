import { types, getRoot } from 'mobx-state-tree'

function compareByTimestamp(a, b) {
  return b.timestamp - a.timestamp
}

const AnnouncementModel = types
  .model('Announcement', {
    id: types.identifier,
    summary: types.string,
    details: types.string,
    timestamp: types.Date,
    status: types.union(types.literal('read'), types.literal('unread')),
    priority: types.union(types.literal('low'), types.literal('high'))
  })
  .actions(self => ({
    toggle() {
      self.status = self.status === 'read' ? 'unread' : 'read'
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
      return self.all
        .filter(a => a.status === 'unread')
        .sort(compareByTimestamp)
    },
    get read() {
      return self.all.filter(a => a.status === 'read').sort(compareByTimestamp)
    },
    get snackbar() {
      const importantUnread = self.unread.find(a => a.priority === 'high')
      return importantUnread && getRoot(self).view.page !== '/announcements'
        ? importantUnread.summary
        : ''
    }
  }))
  .actions(self => ({
    add(announcement) {
      self.all.push(announcement)
    },
    remove(id) {
      const index = self.all.findIndex(a => a.id === id)
      if (index > -1) self.all.splice(index, 1)
    },
    clearAll() {
      self.all = []
    }
  }))

export const Announcements = types.optional(AnnouncementsModel, {})
