import { reaction, autorun } from 'mobx'
import { getSnapshot, applySnapshot } from 'mobx-state-tree'
import { RootStoreType } from './models/RootStore'
import { ViewSnapshotType } from './models/ViewModel'
export default function onStart(rootStore: RootStoreType) {
  // whenever the view changes - push to browser history
  reaction(
    () => rootStore.view.currentURL,
    path => {
      if (window.location.pathname !== path)
        window.history.pushState(null, '', path)
    }
  )

  // handle page load - react to URL
  rootStore.view.setFromURL()
  if (window.location.pathname !== rootStore.view.currentURL)
    window.history.replaceState(null, '', rootStore.view.currentURL)

  // react to user manually navigating through history
  window.onpopstate = function historyChange(ev: PopStateEvent) {
    if (ev.type === 'popstate') rootStore.view.setFromURL()
  }

  // direct user to "login" page if not logged in
  let prevViewSnapshotForLogin: ViewSnapshotType | null
  autorun(() => {
    if (
      !rootStore.loggedInUser &&
      ['/login', '/manualSignup'].every(
        allowedPagesWhenLoggedOut =>
          rootStore.view.page !== allowedPagesWhenLoggedOut
      )
    ) {
      prevViewSnapshotForLogin = getSnapshot(rootStore.view)
      rootStore.view.openLoginPage()
    } else if (rootStore.loggedInUser && prevViewSnapshotForLogin) {
      applySnapshot(rootStore.view, prevViewSnapshotForLogin)
      prevViewSnapshotForLogin = null
    }
  })

  // prevent unauthorized access to "people" page
  let prevViewSnapshotForPeople: ViewSnapshotType | null
  autorun(() => {
    if (rootStore.view.page !== '/people') {
      // store previous page
      prevViewSnapshotForPeople = getSnapshot(rootStore.view)
    } else if (rootStore.loggedInUser?.type !== 'staff') {
      // this is an unauthorized state.

      if (prevViewSnapshotForPeople)
        // restore view to previous page
        applySnapshot(rootStore.view, prevViewSnapshotForPeople)
      // or to homepage
      else rootStore.view.openHomePage()
    }
  })

  // restore focus to main contents whenever page changes
  reaction(
    () => rootStore.view.page,
    _page => {
      document.querySelector('main')?.focus()
    }
  )

  // add a warning for unread announcements
  rootStore.warnings.add({
    message: ``,
    key: `announcements`,
    allowDismiss: false,
    autoHideDuration: null,
    action: {
      onClick: 'open announcements page',
      actionText: 'See Details'
    },
    dismissed: true
  })

  const updateUnreadAnnouncementsWarning = (snackbar: string) => {
    console.log('updating snackbar')
    rootStore.warnings.list
      .get('announcements')
      ?.updateMessageAndStatus(snackbar, !snackbar)
  }
  reaction(
    () => rootStore.announcements.snackbar(),
    updateUnreadAnnouncementsWarning
  )
  setTimeout(
    () => updateUnreadAnnouncementsWarning(rootStore.announcements.snackbar()),
    15000
  )

  // add an "online/offline" status
  window.addEventListener('online', () => rootStore.status.setOnline())
  window.addEventListener('offline', () => rootStore.status.setOffline())

  reaction(
    () => rootStore.status.online,
    online => {
      if (online) {
        rootStore.warnings.removeOne('offline')
      } else {
        rootStore.warnings.add({
          key: 'offline',
          message: 'You are offline',
          action: { onClick: 'dismiss', actionText: 'dismiss' },
          autoHideDuration: null
        })
      }
    }
  )
}
