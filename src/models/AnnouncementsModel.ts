import { types, getRoot, SnapshotIn, Instance } from 'mobx-state-tree'
import { ViewType } from './ViewModel'

function compareByTimestamp(
  a: AnnouncementInstanceType,
  b: AnnouncementInstanceType
) {
  return b.timestamp.getTime() - a.timestamp.getTime()
}

export interface AnnouncementCreateType
  extends SnapshotIn<typeof AnnouncementModel> {}
export interface AnnouncementInstanceType
  extends Instance<typeof AnnouncementModel> {}

const AnnouncementModel = types
  .model('BasicAnnouncementModel', {
    id: types.identifier,
    summary: types.string,
    details: types.string,
    timestamp: types.Date,
    status: types.union(types.literal('read'), types.literal('unread')),
    priority: types.union(types.literal('low'), types.literal('high')),
    expiresOn: types.maybe(types.Date)
  })
  .actions(self => ({
    toggle() {
      self.status = self.status === 'read' ? 'unread' : 'read'
    }
  }))
const AnnouncementsProps = types
  .model({
    all: types.array(AnnouncementModel)
  })
  .views(self => ({
    announcementById(id: string) {
      return self.all.find(a => a.id === id)
    },
    get unread() {
      return self.all
        .filter(a => a.status === 'unread')
        .sort(compareByTimestamp)
    },
    get read() {
      return self.all.filter(a => a.status === 'read').sort(compareByTimestamp)
    }
  }))

  .views(self => ({
    get snackbar() {
      const importantUnread = self.unread.find(a => a.priority === 'high')
      return importantUnread &&
        ((getRoot(self) as any).view as ViewType).page !== '/announcements'
        ? importantUnread.summary
        : ''
    }
  }))

export const AnnouncementsModel = AnnouncementsProps.actions(self => ({
  add(announcement: AnnouncementCreateType) {
    self.all.push(announcement)
  },
  remove(id: string) {
    const index = self.all.findIndex(a => a.id === id)
    if (index > -1) self.all.splice(index, 1)
  },
  clearAll() {
    while (self.all.length) self.all.pop()
  }
}))
