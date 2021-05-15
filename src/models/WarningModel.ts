import { values, entries } from 'mobx'
import {
  Instance,
  types,
  getRoot,
  getParent,
  SnapshotIn
} from 'mobx-state-tree'
import { RootStoreType } from './RootStore'
import { ViewType } from './ViewModel'

export interface WarningType extends Instance<typeof WarningModel> {}
export interface WarningsType extends Instance<typeof WarningsModel> {}
export interface WarningCreationType extends SnapshotIn<typeof WarningModel> {}

export const WarningModel = types
  .model('WarningModel', {
    key: types.identifier,
    message: types.string,
    autoHideDuration: types.optional(types.maybeNull(types.number), 5000),
    allowDismiss: types.optional(types.boolean, true),
    dismissed: types.optional(types.boolean, false),
    action: types.maybe(
      types.model('Action', {
        onClick: types.union(
          types.literal('dismiss'),
          types.literal('open announcements page'),
          types.literal('open chat page')
        ),
        actionText: types.string
      })
    )
  })
  .actions(self => ({
    updateMessageAndStatus(message: string, dismissed: boolean) {
      self.message = message
      self.dismissed = dismissed
      ;(getParent(self, 2) as WarningsType).updateWarningsCounter()
    }
  }))
  .actions(self => ({
    performAction(store: RootStoreType) {
      switch (self.action?.onClick) {
        case 'open announcements page': {
          ;(store.view as ViewType).openAnnouncementsPage()
          store.announcements.exitEditMode()
          return
        }
        case 'dismiss': {
          self.updateMessageAndStatus(self.message, true)
        }
      }
    }
  }))

export const WarningsModel = types
  .model('WarningsModel', {
    internalList: types.map(WarningModel),
    warningUpdateCounter: types.optional(types.number, 1)
  })
  .views(self => ({
    // the list of all warnings
    list(): WarningType[] {
      const internalList = (entries(self.internalList) as unknown) as [
        string,
        WarningType
      ][]

      const list = Array.from(internalList).map(a => a[1])

      const announcementsSnackbar = (getRoot(
        self
      ) as RootStoreType).announcements.snackbar()

      if (announcementsSnackbar)
        list.push(
          WarningModel.create({
            message: announcementsSnackbar,
            key: `announcements`,
            allowDismiss: false,
            autoHideDuration: null,
            action: {
              onClick: 'open announcements page',
              actionText: 'See Details'
            },
            dismissed: false
          })
        )
      return list
    }
  }))
  .actions(self => ({
    add(warning: WarningCreationType) {
      if (!self.internalList.get(warning.key)) {
        self.internalList.put(WarningModel.create(warning))
        self.warningUpdateCounter++
      }
    },
    dismissOne(key: string) {
      if (
        ((values(self.internalList) as unknown) as WarningType[]).find(
          warning => warning.key === key
        )
      ) {
        const warning = self.internalList.get(key)

        if (warning && warning.allowDismiss) {
          warning.dismissed = true
          self.warningUpdateCounter++
        }
      }
    },
    removeOne(key: string) {
      const warning = self.internalList.get(key)

      if (warning) {
        self.internalList.delete(key)
        self.warningUpdateCounter++
      }
    },
    updateWarningsCounter() {
      self.warningUpdateCounter++
    },
    clearAll() {
      self.internalList.clear()
      self.warningUpdateCounter++
    }
  }))
