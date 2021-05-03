import { types, Instance, SnapshotOut } from 'mobx-state-tree'
import { match, compile } from 'path-to-regexp'

export interface ViewType extends Instance<typeof ViewModel> {}
export interface ViewSnapshotType extends SnapshotOut<typeof ViewModel> {}
const ViewModel = types
  .model('View', {
    page: types.union(
      types.literal(''),
      types.literal('/'),
      types.literal('/activities'),
      types.literal('/announcements'),
      types.literal('/announcements/details'),
      types.literal('/announcements/new'),
      types.literal('/chat'),
      types.literal('/custom'),
      types.literal('/info-section'),
      types.literal('/info-section/arriving-at-the-airport'),
      types.literal('/info-section/practice-guide'),
      types.literal('/info-section/abc/123'),
      types.literal('/login'),
      types.literal('/manualSignup'),
      types.literal('/people'),
      types.literal('/people/in-house'),
      types.literal('/people/arriving-today'),
      types.literal('/people/arriving-tomorrow'),
      types.literal('/people/arriving-soon'),
      types.literal('/people/departing-today'),
      types.literal('/people/departing-tomorrow'),
      types.literal('/people/search'),
      types.refinement(types.string, value => !!value.match(/^\/people\/\d+$/)),
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
        case '/people':
        case '/chat':
          if (self.id) return `${self.page}/${self.id}`
          return self.page
        default:
          return self.page
      }
    }
  }))

  .actions(self => ({
    openActivitiesPage: () => (self.page = '/activities'),
    openAnnouncementsPage: () => (self.page = '/announcements'),
    openAnnouncementsNewDraftPage: () => {
      self.page = '/announcements/new'
    },
    openAnnouncementsDetailsPage: (id: string) => {
      self.page = '/announcements/details'
      self.id = id
    },
    openChatPage: (id?: string) => {
      self.page = '/chat'
      self.id = id
    },
    openCustomPage(id: string) {
      self.page = '/custom'
      self.id = id
    },
    openHomePage() {
      self.page = '/'
      self.id = undefined
    },
    openInfoSectionPage: (id?: string) => {
      self.page = '/info-section'
      self.id = id
    },
    openInfoSectionAbc123() {
      self.page = '/info-section/abc/123'
    },
    openInfoSectionArriving() {
      self.page = '/info-section/arriving-at-the-airport'
    },
    openManualSignupPage: () => (self.page = '/manualSignup'),
    openLoginPage: () => (self.page = '/login'),
    openPeoplePage: (subPage?: string) => {
      if (subPage?.match(/^\d+$/)) {
        self.page = '/people'
        self.id = subPage
      } else self.page = subPage ? `/people/${subPage}` : '/people'
    },

    // (self.page = subPage ? `/people/${subPage}` : '/people'),
    openSettingsPage: () => (self.page = '/settings'),
    setFromURL() {
      const newView = getViewFromURL()
      self.page = newView.page
      self.id = newView.id
    }
  }))

export const CurrentViewModel = types.optional(ViewModel, getViewFromURL())

function getViewFromURL() {
  const { pathname } = window.location
  const matchCustom = match<{ id: string }>('/custom/:id')
  const matchedCustom = matchCustom(pathname)

  if (matchedCustom) return { page: '/custom', id: matchedCustom.params.id }

  const matchPeople = match<{ subpage: string }>('/people/:subpage')
  const matchedPeople = matchPeople(pathname)

  if (matchedPeople && matchedPeople.params.subpage.match(/^\d+$/)) {
    return { page: '/people', id: matchedPeople.params.subpage }
  }

  const matchChat = match<{ subpage: string }>('/chat/:subpage')
  const matchedChat = matchChat(pathname)

  if (matchedChat) {
    if (matchedChat.params.subpage.match(/^\d+$/)) {
      return { page: '/chat', id: matchedChat.params.subpage }
    }
  }

  const matchAnnouncements = match<{ id: string }>('/announcements/details/:id')
  const matchedAnnouncements = matchAnnouncements(pathname)

  if (matchedAnnouncements) {
    return {
      page: '/announcements/details',
      id: matchedAnnouncements.params.id
    }
  }

  const matchGeneral = match<{
    page: string
    subpage?: string
    subpage2?: string
  }>('/:page/:subpage?/:subpage2?')
  const matchedGeneral = matchGeneral(pathname)

  if (matchedGeneral)
    switch (matchedGeneral && matchedGeneral.path) {
      case '':
      case '/':
        return { page: '/' }
      case '/activities':
      case '/announcements':
      case '/announcements/new':
      case '/chat':
      case '/info-section':
      case '/info-section/arriving-at-the-airport':
      case '/info-section/practice-guide':
      case '/info-section/abc/123':
      case '/login':
      case '/manualSignup':
      case '/people':
      case '/people/in-house':
      case '/people/arriving-today':
      case '/people/arriving-tomorrow':
      case '/people/arriving-soon':
      case '/people/departing-today':
      case '/people/departing-tomorrow':
      case '/people/search':
      case '/settings': {
        return {
          page: matchedGeneral && matchedGeneral.path
        }
      }
      case '/people/':
        return { page: '/people' }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
