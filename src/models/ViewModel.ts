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
      types.literal('/announcements/stats'),
      types.literal('/announcements/edit'),
      types.literal('/announcements/new'),
      types.literal('/chat'),
      types.literal('/custom'),
      types.literal('/info-section'),
      types.literal('/info-section/arriving-at-the-airport'),
      types.literal('/info-section/practice-guide'),
      types.literal('/info-section/covid-19-guidelines'),
      types.literal('/info-section/abc/123'),
      types.literal('/login'),
      types.literal('/manualSignup'),
      types.literal('/registrations'),
      types.literal('/registrations/in-house'),
      types.literal('/registrations/arriving-today'),
      types.literal('/registrations/arriving-tomorrow'),
      types.literal('/registrations/arriving-soon'),
      types.literal('/registrations/departing-today'),
      types.literal('/registrations/departing-tomorrow'),
      types.literal('/registrations/search'),
      types.refinement(
        types.string,
        value => !!value.match(/^\/registrations\/\d+$/)
      ),
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
        case '/registrations':
        case '/chat':
        case '/announcements/edit':
        case '/announcements/stats':
          if (self.id) return `${self.page}/${self.id}`
          return self.page
        default:
          return self.page
      }
    }
  }))

  // notice: both self.page & self.id have to be updated
  .actions(self => ({
    openActivitiesPage: () => {
      self.page = '/activities'
      self.id = undefined
    },
    openAnnouncementsPage: () => {
      self.page = '/announcements'
      self.id = undefined
    },
    openAnnouncementsNewDraftPage: () => {
      self.page = '/announcements/new'
      self.id = undefined
    },
    openAnnouncementsEditPage: (id: string) => {
      self.page = '/announcements/edit'
      self.id = id
    },
    openAnnouncementsStatsPage: (id: string) => {
      self.page = '/announcements/stats'
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
      self.id = undefined
      if (id) self.page = `/info-section/${id}`
      else self.page = `/info-section`
    },
    openInfoSectionAbc123() {
      self.page = '/info-section/abc/123'
      self.id = undefined
    },
    openInfoSectionArriving() {
      self.page = '/info-section/arriving-at-the-airport'
      self.id = undefined
    },
    openManualSignupPage: () => {
      self.page = '/manualSignup'
      self.id = undefined
    },
    openLoginPage: () => {
      self.page = '/login'
      self.id = undefined
    },
    openRegistrationsPage: (subPage?: string) => {
      self.id = subPage
      if (subPage?.match(/^\d+$/)) {
        self.page = '/registrations'
      } else
        self.page = subPage ? `/registrations/${subPage}` : '/registrations'
    },
    openSettingsPage: () => {
      self.page = '/settings'
      self.id = undefined
    },
    setFromURL() {
      const newView = getViewFromURL()
      self.page = newView.page
      self.id = newView.id
    }
  }))

export const CurrentViewModel = types.optional(ViewModel, getViewFromURL())

function getViewFromURL() {
  const { pathname } = window.location

  // custom page (template, not in use)
  const matchedCustom = match<{ id: string }>('/custom/:id')(pathname)
  if (matchedCustom) return { page: '/custom', id: matchedCustom.params.id }

  // match custom registration pages
  const matchedRegistrations = match<{ subpage: string }>(
    '/registrations/:subpage'
  )(pathname)
  if (
    matchedRegistrations &&
    matchedRegistrations.params.subpage.match(/^\d+$/)
  ) {
    return { page: '/registrations', id: matchedRegistrations.params.subpage }
  }

  // match custom chat pages
  const matchedChat = match<{ subpage: string }>('/chat/:subpage')(pathname)
  if (matchedChat) {
    if (matchedChat.params.subpage.match(/^\d+$/)) {
      return { page: '/chat', id: matchedChat.params.subpage }
    }
  }

  // catch either an edit or stats page of an announcement
  const matchedAnnouncements = match<{ id: string }>(
    '/announcements/(stats|edit)/:id'
  )(pathname)
  if (matchedAnnouncements) {
    return {
      page:
        // page will be either /announcements/stats or /announcements/edit
        matchedAnnouncements &&
        matchedAnnouncements.path.replace(/\/[^/]*$/, ''),
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
      case '/info-section/covid-19-guidelines':
      case '/info-section/abc/123':
      case '/login':
      case '/manualSignup':
      case '/registrations':
      case '/registrations/in-house':
      case '/registrations/arriving-today':
      case '/registrations/arriving-tomorrow':
      case '/registrations/arriving-soon':
      case '/registrations/departing-today':
      case '/registrations/departing-tomorrow':
      case '/registrations/search':
      case '/settings': {
        return {
          page: matchedGeneral && matchedGeneral.path
        }
      }
      case '/registrations/':
        return { page: '/registrations' }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
