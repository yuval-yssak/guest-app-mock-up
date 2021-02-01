import { types } from 'mobx-state-tree'
import { match, compile } from 'path-to-regexp'

const viewModel = types
  .model('View', {
    page: types.union(
      types.literal(''),
      types.literal('/'),
      types.literal('/chat'),
      types.literal('/announcements'),
      types.literal('/activities'),
      types.literal('/settings'),
      types.literal('/custom')
    ),
    id: types.maybe(types.string)
  })
  .views(self => ({
    get currentURL() {
      switch (self.page) {
        case '':
        case '/':
          return '/'
        case '/custom':
          const toPath = compile('/custom/:id')
          return toPath({ id: self.id || '' })
        default:
          return self.page
      }
    }
  }))

  .actions(self => ({
    openHomePage() {
      self.page = '/'
      self.id = undefined
    },
    openCustomPage(id) {
      self.page = '/custom'
      self.id = id
    },
    openAnnouncementsPage: () => (self.page = '/announcements'),
    openActivitiesPage: () => (self.page = '/activities'),
    openSettingsPage: () => (self.page = '/settings'),
    openChatPage: () => (self.page = '/chat'),
    setFromURL() {
      const newView = getViewFromURL()
      self.page = newView.page
      self.id = newView.id
    }
  }))

export const View = types.optional(viewModel, getViewFromURL())

function getViewFromURL() {
  const { pathname } = window.location
  const matchCustom = match('/custom/:id')
  const matchedCustom = matchCustom(pathname)

  if (matchedCustom) return { page: 'custom', id: matchedCustom.params.id }

  const matchGeneral = match('/:page')
  const matchedGeneral = matchGeneral(pathname)

  if (matchedGeneral)
    switch (matchedGeneral.path) {
      case '':
      case '/':
        return { page: '/' }
      case '/chat':
      case '/activities':
      case '/settings':
      case '/announcements':
        return { page: matchedGeneral.path }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
