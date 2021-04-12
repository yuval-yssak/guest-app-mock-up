import { types, Instance, SnapshotIn } from 'mobx-state-tree'
import { CurrentViewModel } from './ViewModel'
import { Preferences } from './PreferencesModel'
import { AnnouncementsModel } from './AnnouncementsModel'
import { ChatsModel } from './ChatModel'
import { UserModel, UserType } from './UserModel'
import { WarningsModel } from './WarningModel'

export interface RootStoreType extends Instance<typeof RootStore> {}
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}
export const RootStore = types
  .model('rootStore', {
    view: CurrentViewModel,
    preferences: Preferences,
    announcements: types.optional(AnnouncementsModel, {}),
    chats: types.optional(ChatsModel, { withSelf: { messages: [] } }),
    loggedInUser: types.maybeNull(types.reference(UserModel)),
    users: types.array(UserModel),
    warnings: types.optional(WarningsModel, {})
  })
  .actions(self => ({
    addUsers(newUsers: UserType[]) {
      self.users.push(...newUsers)
    }
  }))
