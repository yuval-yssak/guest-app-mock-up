import { reaction, autorun } from 'mobx'
import { getSnapshot, applySnapshot } from 'mobx-state-tree'

export default function onStart(store) {
  // whenever the view changes - push to browser history
  reaction(
    () => store.view.currentURL,
    path => {
      if (window.location.pathname !== path)
        window.history.pushState(null, '', path)
    }
  )

  // handle page load - react to URL
  store.view.setFromURL()
  if (window.location.pathname !== store.view.currentURL)
    window.history.replaceState(null, '', store.view.currentURL)

  // react to user manually navigating through history
  window.onpopstate = function historyChange(ev) {
    if (ev.type === 'popstate') store.view.setFromURL()
  }

  // direct user to "login" page if not logged in
  let prevViewSnapshot
  autorun(() => {
    if (
      !store.loggedInUser &&
      ['/login', '/manualSignup'].every(
        allowedPagesWhenLoggedOut =>
          store.view.page !== allowedPagesWhenLoggedOut
      )
    ) {
      prevViewSnapshot = getSnapshot(store.view)
      store.view.openLoginPage()
    } else if (store.loggedInUser && prevViewSnapshot) {
      applySnapshot(store.view, prevViewSnapshot)
      prevViewSnapshot = null
    }
  })

  // restore focus to main contents whenever page changes
  reaction(
    () => store.view.page,
    _page => {
      document.querySelector('main').focus()
    }
  )
}
