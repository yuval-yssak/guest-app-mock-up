import { types } from 'mobx-state-tree'
import { PersonModel } from './PersonModel'

const LoggedInUserModel = PersonModel.named('LoggedInUserModel').props({
  type: types.union(types.literal('guest'), types.literal('staff'))
})

export { LoggedInUserModel }
