import { types } from 'mobx-state-tree'

const LoggedInUserModel = types
  .model('Logged In User', {
    personName: types.string,
    imageSrc: types.maybe(types.string)
  })
  .actions(self => ({}))

export const LoggedInUser = types.maybe(LoggedInUserModel)
