import { Instance, types } from 'mobx-state-tree'

export interface UserType extends Instance<typeof UserModel> {}

export const UserModel = types.model('UserModel', {
  id: types.identifierNumber,
  personName: types.string,
  imageSrc: types.string,
  type: types.union(types.literal('guest'), types.literal('staff')),
  inHouse: types.optional(types.boolean, true)
})
