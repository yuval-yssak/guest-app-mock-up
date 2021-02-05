import { types } from 'mobx-state-tree'
import { match, compile } from 'path-to-regexp'

const viewModel = types
  .model('View', {
    page: types.union(
      types.literal(''),
      types.literal('/'),
      types.literal('/activities'),
      types.literal('/announcements'),
      types.literal('/chat'),
      types.literal('/custom'),
      types.literal('/info-section'),
      types.literal('/settings')
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
          const customToPath = compile('/custom/:id')
          return customToPath({ id: self.id || '' })
        case '/info-section':
          if (self.id) {
            const infoSectionToPath = compile('/info-section/:id')
            return infoSectionToPath({ id: self.id })
          }
          return self.page
        default:
          return self.page
      }
    }
  }))

  .actions(self => ({
    openActivitiesPage: () => (self.page = '/activities'),
    openAnnouncementsPage: () => (self.page = '/announcements'),
    openChatPage: () => (self.page = '/chat'),
    openCustomPage(id) {
      self.page = '/custom'
      self.id = id
    },
    openHomePage() {
      self.page = '/'
      self.id = undefined
    },
    openInfoSectionPage: id => {
      self.page = '/info-section'
      self.id = id
    },
    openSettingsPage: () => (self.page = '/settings'),
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

  const matchInfoSection = match('/info-section/:id')
  const matchedInfoSection = matchInfoSection(pathname)

  if (matchedInfoSection)
    return {
      page: '/info-section',
      id: matchedInfoSection.params.id
    }

  const matchGeneral = match('/:page')
  const matchedGeneral = matchGeneral(pathname)

  if (matchedGeneral)
    switch (matchedGeneral.path) {
      case '':
      case '/':
        return { page: '/' }
      case '/activities':
      case '/announcements':
      case '/chat':
      case '/info-section':
      case '/settings':
        return { page: matchedGeneral.path }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
