import { types } from 'mobx-state-tree'
import { View } from './View'

export const Store = types.model('rootStore', { view: View })
