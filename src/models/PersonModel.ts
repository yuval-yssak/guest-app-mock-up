import { Instance, types } from 'mobx-state-tree'

export interface PersonType extends Instance<typeof PersonModel> {}

export const PersonModel = types.model('PersonModel', {
  id: types.identifier,
  personName: types.string,
  imageSrc: types.string
})
