import { types, Instance, SnapshotOut } from 'mobx-state-tree'
import { match, compile, MatchResult } from 'path-to-regexp'

export interface ViewType extends Instance<typeof ViewModel> {}
export interface ViewSnapshotType extends SnapshotOut<typeof ViewModel> {}
const ViewModel = types
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
      types.refinement(types.string, page => !!page.match(/^\/people\/\d+$/)),
      types.literal('/registration'),
      types.literal('/settings')
    ),
    id: types.maybeNull(types.string)
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
          if (self.id) return `${self.page}/${self.id}`
          return self.page
        case '/registration':
          return `${self.page}/${self.id}`
        default:
          return self.page
      }
    }
  }))

  .actions(self => ({
    openActivitiesPage: () => (self.page = '/activities'),
    openAnnouncementsPage: () => (self.page = '/announcements'),
    openChatPage: () => (self.page = '/chat'),
    openCustomPage(id: string) {
      self.page = '/custom'
      self.id = id
    },
    openHomePage() {
      self.page = '/'
      self.id = null
    },
    openInfoSectionPage: (id?: string) => {
      self.page = '/info-section'
      self.id = id || null
    },
    openInfoSectionAbc123() {
      self.page = '/info-section/abc/123'
      self.id = null
    },
    openInfoSectionArriving() {
      self.page = '/info-section/arriving-at-the-airport'
      self.id = null
    },
    openManualSignupPage: () => {
      self.page = '/manualSignup'
      self.id = null
    },
    openLoginPage: () => {
      self.page = '/login'
      self.id = null
    },
    openPeoplePage: (subPage?: string) => {
      console.log('in function people page', subPage)
      if (subPage?.match(/^\d+$/)) {
        console.log('hi')
        self.page = '/people'
        self.id = subPage
      } else {
        self.page = subPage ? `/people/${subPage}` : '/people'
        self.id = null
      }
    },

    openRegistrationPage: (id: string) => {
      self.page = `/registration`
      self.id = id
    },

    // (self.page = subPage ? `/people/${subPage}` : '/people'),
    openSettingsPage: () => {
      self.page = '/settings'
      self.id = null
    },
    setFromURL() {
      const newView = getViewFromURL()
      self.page = newView.page
      self.id = newView.id || null
    }
  }))

export const CurrentViewModel = types.optional(ViewModel, getViewFromURL())

function getViewFromURL() {
  const { pathname } = window.location
  const matchCustom = match<{ id: string }>('/custom/:id')
  const matchedCustom = matchCustom(pathname)

  if (matchedCustom) return { page: '/custom', id: matchedCustom.params.id }

  const matchInfoSection = match([
    '/info-section/:id1/:id2',
    '/info-section/:id1'
  ])
  const matchedInfoSection = matchInfoSection(pathname) as MatchResult

  const matchPeople = match('/people/:subpage')
  const matchedPeople = matchPeople(pathname) as MatchResult<{
    subpage: string
  }>

  if (matchedPeople) {
    if (matchedPeople.params.subpage?.match(/^\d+$/)) {
      return { page: '/people', id: matchedPeople.params.subpage }
    }
  }

  const matchRegistration = match<{ subpage: string }>('/registration/:subpage')
  const matchedRegistration = matchRegistration(pathname)

  if (matchedRegistration) {
    if (matchedRegistration.params.subpage?.match(/^\d+$/))
      return { page: '/registration', id: matchedRegistration.params.subpage }
  }

  const matchGeneral = match<{ page: string }>('/:page')
  const matchedGeneral = matchGeneral(pathname) as MatchResult
  if (matchedGeneral || matchedInfoSection || matchedPeople)
    switch (
      matchedGeneral.path ||
      matchedInfoSection.path ||
      matchedPeople.path
    ) {
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
        console.log('path is', matchedPeople.path)
        return {
          page:
            matchedGeneral.path || matchedInfoSection.path || matchedPeople.path
        }
      }
      case '/people/':
        return { page: '/people' }
      default:
        return { page: '/' }
    }
  else return { page: '/' }
}
