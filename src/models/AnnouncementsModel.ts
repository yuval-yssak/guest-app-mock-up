import {
  types,
  getRoot,
  getParent,
  SnapshotIn,
  Instance
} from 'mobx-state-tree'
import { UserModel } from './UserModel'
import { ViewType } from './ViewModel'

function compareByTimestamp(
  a: AnnouncementInstanceType,
  b: AnnouncementInstanceType
) {
  return b.publishOn.getTime() - a.publishOn.getTime()
}

export interface AnnouncementCreateType
  extends SnapshotIn<typeof AnnouncementModel> {}
export interface AnnouncementInstanceType
  extends Instance<typeof AnnouncementModel> {}

const AnnouncementDraftModel = types.model('AnnouncementDraftModel', {
  summary: types.string,
  details: types.string,
  publishOn: types.maybe(types.Date),
  publishEnd: types.maybe(types.Date),
  priority: types.union(types.literal('low'), types.literal('high')),
  sendNotification: types.boolean
})

const AnnouncementModel = types
  .model('BasicAnnouncementModel', {
    id: types.identifier,
    summary: types.string,
    details: types.string,
    publishOn: types.Date,
    status: types.union(types.literal('read'), types.literal('unread')),
    priority: types.union(types.literal('low'), types.literal('high')),
    publishEnd: types.Date,
    sendNotification: types.optional(types.boolean, false),
    // stats are available only to staff
    stats: types.maybe(
      types.model('AnnouncementStatsModel', {
        readBy: types.array(types.reference(UserModel))
      })
    )
  })
  .actions(self => ({
    toggle() {
      self.status = self.status === 'read' ? 'unread' : 'read'
    }
  }))

const EditAnnouncementModel = types.model('EditAnnouncementModel', {
  announcement: types.reference(AnnouncementModel),
  editingPublishOn: types.Date,
  editingPublishEnd: types.Date,
  editingPriority: types.union(types.literal('low'), types.literal('high')),
  editingSendNotification: types.boolean
})

const EditModeModel = types
  .model('EditModeModel', {
    newDraft: types.maybe(AnnouncementDraftModel),
    editAnnouncement: types.maybe(EditAnnouncementModel)
  })
  .actions(self => ({
    startNewDraft() {
      self.newDraft = AnnouncementDraftModel.create({
        summary: '',
        details: '',
        priority: 'low',
        sendNotification: false
      })
    },
    discardDraft() {
      self.newDraft = undefined
    },
    editAnnouncement(id: string) {
      const announcement = ((getParent(self, 1) as any)
        .all as AnnouncementInstanceType[]).find(a => a.id === id)
      if (announcement)
        self.editAnnouncement = EditAnnouncementModel.create({
          announcement: id,
          editingPublishEnd: announcement?.publishEnd,
          editingPublishOn: announcement?.publishOn,
          editingPriority: announcement?.priority,
          editingSendNotification: announcement.sendNotification
        })
    },
    discardEditing() {
      self.editAnnouncement = undefined
    }
  }))

const AnnouncementsProps = types
  .model({
    all: types.array(AnnouncementModel),
    editMode: types.maybe(EditModeModel)
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
  .volatile(_self => ({ initialDelay: true }))
  .views(self => ({
    snackbar() {
      const importantUnreadCount = self.unread.filter(
        a => a.priority === 'high'
      ).length

      return !self.initialDelay &&
        importantUnreadCount &&
        ((getRoot(self) as any).view as ViewType).page !== '/announcements'
        ? `${importantUnreadCount} new important announcements`
        : ''
    }
  }))
  .actions(self => ({
    endSnackbarInitialDelay() {
      self.initialDelay = false
    },
    enterIntoEditMode() {
      if (!self.editMode) self.editMode = EditModeModel.create()
    }
  }))

export interface AnnouncementsInstanceType
  extends Instance<typeof AnnouncementsModel> {}

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
