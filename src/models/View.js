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
      types.literal('/info-section/arriving-at-the-airport'),
      types.literal('/info-section/practice-guide'),
      types.literal('/info-section/abc/123'),
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
    openInfoSectionAbc123() {
      self.page = '/info-section/abc/123'
    },
    openInfoSectionArriving() {
      self.page = '/info-section/arriving-at-the-airport'
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

  const matchInfoSection = match([
    '/info-section/:id1/:id2',
    '/info-section/:id1'
  ])
  const matchedInfoSection = matchInfoSection(pathname)

  const matchGeneral = match('/:page')
  const matchedGeneral = matchGeneral(pathname)
  console.log(matchedInfoSection)
  console.log(matchedInfoSection.path)
  console.log('path is', matchedGeneral.path || matchedInfoSection.path)
  if (matchedGeneral || matchedInfoSection)
    switch (matchedGeneral.path || matchedInfoSection.path) {
      case '':
      case '/':
        return { page: '/' }
      case '/activities':
      case '/announcements':
      case '/chat':
      case '/info-section':
      case '/info-section/arriving-at-the-airport':
      case '/info-section/practice-guide':
      case '/info-section/abc/123':
      case '/settings':
        return { page: matchedGeneral.path || matchedInfoSection.path }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
