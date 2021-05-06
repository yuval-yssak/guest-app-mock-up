import {
  types,
  getRoot,
  SnapshotIn,
  Instance,
  getSnapshot
} from 'mobx-state-tree'
import { ViewType } from './ViewModel'
import { UserModel, UserType } from './UserModel'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'

export interface AnnouncementCreateType
  extends SnapshotIn<typeof AnnouncementModel> {}
export interface AnnouncementInstanceType
  extends Instance<typeof AnnouncementModel> {}

const AudienceModel = types.optional(
  types.model({
    everyoneInHouse: types.maybe(types.boolean),
    allGuestsAndChildren: types.maybe(types.boolean)
  }),
  { everyoneInHouse: true }
)

const AnnouncementDraftModel = types
  .model('AnnouncementDraftModel', {
    subject: types.string,
    bodyText: types.string,
    publishOn: types.maybe(types.Date),
    publishEnd: types.optional(types.Date, dayjs().add(2, 'days').toDate()),
    priority: types.union(types.literal('low'), types.literal('high')),
    sendNotification: types.boolean,
    audience: AudienceModel
  })
  .actions(self => ({
    setSubject(newSubject: string) {
      self.subject = newSubject
    },
    setBodyText(newBodyText: string) {
      self.bodyText = newBodyText
    },
    setPublishOn(newDate: Date | undefined) {
      self.publishOn = newDate
    },
    setPublishEnd(newDate: Date) {
      self.publishEnd = newDate
    },
    togglePriority() {
      self.priority = self.priority === 'high' ? 'low' : 'high'
    },
    toggleNotify() {
      self.sendNotification = !self.sendNotification
    }
  }))

const AnnouncementReadStatsModel = types.model('AnnouncementReadStatsModel', {
  readBy: types.reference(UserModel),
  timestamp: types.Date
})

export const AnnouncementStatsModel = types
  .model('AnnouncementStatsModel', {
    readStatistics: types.array(AnnouncementReadStatsModel)
  })
  .views(self => ({
    get readPercentage() {
      const readCount = self.readStatistics.filter(r => r.readBy.inHouse).length

      const rootStore = getRoot(self) as any

      const usersCount = (rootStore.users as UserType[]).filter(u => u.inHouse)
        .length
      return (readCount / usersCount) * 100
    }
  }))

const AdminModel = types.model('AdminModel', {
  sendNotification: types.optional(types.boolean, false),
  stats: AnnouncementStatsModel
})

const AnnouncementModel = types
  .model('BasicAnnouncementModel', {
    id: types.identifier,
    subject: types.string,
    bodyText: types.string,
    publishOn: types.Date,
    status: types.union(types.literal('read'), types.literal('unread')),
    priority: types.union(types.literal('low'), types.literal('high')),
    publishEnd: types.Date,
    audience: AudienceModel,
    admin: types.maybe(AdminModel)
  })
  .actions(self => ({
    toggle() {
      self.status = self.status === 'read' ? 'unread' : 'read'
    }
  }))

const EditModeModel = types
  .model('EditModeModel', {
    newDraft: types.maybe(AnnouncementDraftModel)
  })
  .actions(self => ({
    clearDraft() {
      self.newDraft = AnnouncementDraftModel.create({
        subject: '',
        bodyText: '',
        priority: 'low',
        publishOn: undefined,
        publishEnd: dayjs().add(2, 'days').toDate(),
        sendNotification: false
      })
    }
  }))

const AnnouncementsProps = types
  .model({
    _all: types.array(AnnouncementModel),
    editMode: types.maybe(EditModeModel)
  })
  .views(self => ({
    get active() {
      return self._all.filter(
        a =>
          dayjs(now(60000)).isAfter(a.publishOn) &&
          dayjs(now(60000)).isBefore(a.publishEnd)
      )
    },
    get archived() {
      return self._all.filter(
        a =>
          !(
            dayjs(now(60000)).isAfter(a.publishOn) &&
            dayjs(now(60000)).isBefore(a.publishEnd)
          )
      )
    }
  }))
  .views(self => ({
    announcementById(id: string) {
      return self._all.find(a => a.id === id)
    },
    get unread() {
      return self.active
        .filter(a => a.status === 'unread')
        .sort(compareByTimestamp)
    },
    get read() {
      return self.active
        .filter(a => a.status === 'read')
        .sort(compareByTimestamp)
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
        ? `${importantUnreadCount} new important announcement${
            importantUnreadCount > 1 ? `s` : ''
          }`
        : ''
    }
  }))
  .actions(self => ({
    endSnackbarInitialDelay() {
      self.initialDelay = false
    },
    enterIntoEditMode() {
      if (!self.editMode) {
        self.editMode = EditModeModel.create({
          newDraft: {
            subject: '',
            bodyText: '',
            priority: 'low',
            sendNotification: false
          }
        })
      }
    },
    exitEditMode() {
      self.editMode = undefined
    }
  }))

export const AnnouncementsModel = AnnouncementsProps.actions(self => ({
  add(announcement: AnnouncementCreateType) {
    self._all.push(announcement)
  },
  remove(id: string) {
    const index = self._all.findIndex(a => a.id === id)
    if (index > -1) self._all.splice(index, 1)
  },
  removeAll() {
    while (self._all.length) self._all.pop()
  }
})).actions(self => ({
  saveDraft() {
    const newDraft = self.editMode?.newDraft

    if (newDraft?.subject.trim() && newDraft.bodyText.trim()) {
      const announcement: AnnouncementCreateType = {
        subject: newDraft.subject,
        bodyText: newDraft.bodyText,
        publishOn: newDraft.publishOn || Date.now(),
        publishEnd: newDraft.publishEnd,
        audience: getSnapshot(newDraft.audience),
        status: 'read',
        id: Math.random().toString(36).slice(2),
        priority: newDraft.priority
      }

      self.add(announcement)
      self.editMode?.clearDraft()
    }
  }
}))

function compareByTimestamp(
  a: AnnouncementInstanceType,
  b: AnnouncementInstanceType
) {
  return b.publishOn.getTime() - a.publishOn.getTime()
}

export interface AnnouncementsInstanceType
  extends Instance<typeof AnnouncementsModel> {}
