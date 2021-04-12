import {
  Instance,
  types,
  getRoot,
  getParent,
  SnapshotIn
} from 'mobx-state-tree'
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
    performAction() {
      switch (self.action?.onClick) {
        case 'open announcements page': {
          ;((getRoot(self) as any).view as ViewType).openAnnouncementsPage()
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
    list: types.map(WarningModel),
    warningUpdateCounter: types.optional(types.number, 1)
  })
  .actions(self => ({
    add(warning: WarningCreationType) {
      if (!self.list.get(warning.key)) {
        self.list.put(WarningModel.create(warning))
        self.warningUpdateCounter++
      }
    },
    dismissOne(key: string) {
      const warning = self.list.get(key)

      if (warning) {
        warning.dismissed = true
        self.warningUpdateCounter++
      }
    },
    updateWarningsCounter() {
      self.warningUpdateCounter++
    }
  }))
