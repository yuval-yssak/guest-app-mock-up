import { types, getRoot, SnapshotIn, Instance } from 'mobx-state-tree'
import { ViewType } from './ViewModel'
import { UserModel, UserType } from './UserModel'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'

export interface AnnouncementCreateType
  extends SnapshotIn<typeof AnnouncementModel> {}
export interface AnnouncementInstanceType
  extends Instance<typeof AnnouncementModel> {}

const AudienceTarget = types.model('AudienceTarget', {
  targetName: types.maybeNull(
    types.union(
      types.literal('all-residents-and-visitors'),
      types.literal('all-residents'),
      types.literal('all-residents-guests'),
      types.literal('all-residents-guests-no-children'),
      types.literal('all-staff-karma-yogis'),
      types.literal('all-karma-yogis'),
      types.literal('all-staff'),
      types.literal('all-speakers'),
      types.literal('students-in-course')
    )
  ),
  id: types.maybe(types.number) // in case type='students-in-course'
})

const AnnouncementDraftModel = types
  .model('AnnouncementDraftModel', {
    subject: types.string,
    bodyText: types.string,
    publishOn: types.maybeNull(types.Date),
    publishEnd: types.optional(types.Date, dayjs().add(2, 'days').toDate()),
    priority: types.union(types.literal('low'), types.literal('high')),
    sendAlert: types.boolean,
    audience: AudienceTarget
  })
  .actions(self => ({
    setSubject(newSubject: string) {
      self.subject = newSubject
    },
    setBodyText(newBodyText: string) {
      self.bodyText = newBodyText
    },
    setAudience(newAudience: typeof self.audience) {
      self.audience.targetName = newAudience.targetName
      self.audience.id = newAudience.id
    },
    setPublishOn(newDate: Date | null) {
      self.publishOn = newDate
    },
    setPublishEnd(newDate: Date) {
      self.publishEnd = newDate
    },
    togglePriority() {
      self.priority = self.priority === 'high' ? 'low' : 'high'
    },
    toggleNotify() {
      self.sendAlert = !self.sendAlert
    }
  }))

const AnnouncementReadStatsModel = types.model('AnnouncementReadStatsModel', {
  readBy: types.reference(UserModel), // should be PersonModel
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

      const usersCount = (rootStore.users as UserType[]).filter(
        u => u.inHouse
      ).length
      return (readCount / usersCount) * 100
    }
  }))

const AdminExtensionModel = types.model('AdminExtensionModel', {
  sendAlert: types.optional(types.boolean, false),
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
    sendAlert: types.boolean,
    publishEnd: types.Date,
    audience: AudienceTarget,
    admin: types.maybe(AdminExtensionModel)
  })
  .actions(self => ({
    toggle() {
      self.status = self.status === 'read' ? 'unread' : 'read'
    },
    setSubject(newSubject: string) {
      self.subject = newSubject
    },
    setBodyText(newBodyText: string) {
      self.bodyText = newBodyText
    },
    setPublishOn(newPublishOn: Date) {
      self.publishOn = newPublishOn
    },
    setPublishEnd(newPublishEnd: Date) {
      self.publishEnd = newPublishEnd
    },
    togglePriority() {
      self.priority = self.priority === 'high' ? 'low' : 'high'
    },
    toggleNotify() {
      self.sendAlert = !self.sendAlert
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
        audience: { targetName: null },
        sendAlert: false
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
      return self._all.filter(a =>
        dayjs(now(60000)).add(1, 'minute').isBefore(a.publishEnd)
      )
    },
    get archived() {
      return self._all.filter(
        a => !dayjs(now(60000)).add(1, 'minute').isBefore(a.publishEnd)
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
            audience: { targetName: null },
            sendAlert: false
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
    self._all.unshift(announcement)
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
        audience: {
          targetName: newDraft.audience.targetName,
          id: newDraft.audience.id
        },
        status: 'read',
        sendAlert: newDraft.sendAlert,
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
