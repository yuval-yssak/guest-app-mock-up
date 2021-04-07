import { types, Instance, SnapshotIn } from 'mobx-state-tree'
import { CurrentViewModel } from './ViewModel'
import { Preferences } from './PreferencesModel'
import { AnnouncementsModel } from './AnnouncementsModel'
import { ChatsModel } from './ChatModel'
import { UserModel } from './UserModel'

export interface RootStoreType extends Instance<typeof RootStore> {}
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}
export const RootStore = types.model('rootStore', {
  view: CurrentViewModel,
  preferences: Preferences,
  announcements: types.optional(AnnouncementsModel, {}),
  chats: types.optional(ChatsModel, { withSelf: { messages: [] } }),
  loggedInUser: types.maybeNull(UserModel),
  users: types.array(UserModel)
})
