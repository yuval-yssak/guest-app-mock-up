import { types, Instance, SnapshotIn } from 'mobx-state-tree'
import { CurrentViewModel } from './ViewModel'
import { Preferences } from './PreferencesModel'
import { AnnouncementsModel } from './AnnouncementsModel'
import { ChatsModel } from './ChatModel'
import { UserModel, UserType } from './UserModel'
import { WarningsModel } from './WarningModel'
import { StatusModel } from './StatusModel'

export interface RootStoreType extends Instance<typeof RootStore> {}
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}
export const RootStore = types
  .model('rootStore', {
    view: CurrentViewModel,
    preferences: Preferences,
    announcements: types.optional(AnnouncementsModel, {}),
    chats: types.optional(ChatsModel, { withStaff: { messages: [] } }),
    loggedInUser: types.maybeNull(types.reference(UserModel)),
    users: types.array(UserModel),
    warnings: types.optional(WarningsModel, {}),
    status: types.optional(StatusModel, {})
  })
  .actions(self => ({
    addUsers(newUsers: UserType[]) {
      self.users.push(...newUsers)
    }
  }))
