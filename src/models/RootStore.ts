import { types, Instance, SnapshotIn } from 'mobx-state-tree'
import { CurrentViewModel } from './ViewModel'
import { Preferences } from './PreferencesModel'
import { AnnouncementsModel } from './AnnouncementsModel'
import { Chat } from './ChatModel'
import { UserModel } from './UserModel'

export interface RootStoreType extends Instance<typeof RootStore> {}
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}
export const RootStore = types.model('rootStore', {
  view: CurrentViewModel,
  preferences: Preferences,
  announcements: types.optional(AnnouncementsModel, {}),
  chat: Chat,
  loggedInUser: types.maybeNull(UserModel),
  users: types.array(UserModel)
})
