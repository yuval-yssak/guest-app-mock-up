import dayjs, { Dayjs } from 'dayjs'
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

  // direct user to cover page if not logged in
  let prevViewSnapshotForLogin: ViewSnapshotType | null
  autorun(() => {
    if (
      !rootStore.loggedInUser &&
      ['/', '/login', '/manualSignup'].every(
        allowedPagesWhenLoggedOut =>
          rootStore.view.page !== allowedPagesWhenLoggedOut
      )
    ) {
      prevViewSnapshotForLogin = getSnapshot(rootStore.view)
      rootStore.view.openHomePage()
    } else if (rootStore.loggedInUser && prevViewSnapshotForLogin) {
      applySnapshot(rootStore.view, prevViewSnapshotForLogin)
      prevViewSnapshotForLogin = null
    }
  })

  // prevent unauthorized access to "registrations" page
  let prevViewSnapshotForRegistrations: ViewSnapshotType | null
  autorun(() => {
    if (rootStore.view.page !== '/registrations') {
      // store previous page
      prevViewSnapshotForRegistrations = getSnapshot(rootStore.view)
    } else if (rootStore.loggedInUser?.type !== 'staff') {
      // this is an unauthorized state.

      if (prevViewSnapshotForRegistrations)
        // restore view to previous page
        applySnapshot(rootStore.view, prevViewSnapshotForRegistrations)
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

  reaction(() => rootStore.loggedInUser, resetWarnings)
  resetWarnings()

  setTimeout(() => rootStore.announcements.endSnackbarInitialDelay(), 15000)

  function resetWarnings() {
    rootStore.warnings.clearAll()
  }

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

  // switch into edit mode when page is on a new annoncement
  autorun(() => {
    if (
      ['/announcements/new', '/announcements/edit'].some(
        editingPage => rootStore.view.page === editingPage
      ) &&
      rootStore.loggedInUser?.type === 'staff' &&
      !rootStore.announcements.editMode
    ) {
      rootStore.announcements.enterIntoEditMode()
    }
  })

  // when a chat view is changed after being sustained for over 3 seconds,
  // set it as has been read. (while swapping between chat users)
  let previousChatUserID: string | undefined = rootStore.view.id
  let chatUserIDLastChange: Dayjs
  autorun(() => {
    if (rootStore.view.page !== '/chat') return
    if (rootStore.view.id === previousChatUserID) return

    // the following code will run whenever chat view is switched.

    // If the chat is sustained for over the seconds - SHOW as read.
    if (dayjs().diff(chatUserIDLastChange, 'seconds') >= 3) {
      const previousChat = rootStore.chats.findChat(+(previousChatUserID || ''))
      previousChat?.setToSeeAllMessagesRead()
    }

    previousChatUserID = rootStore.view.id
    chatUserIDLastChange = dayjs()

    // If the chat is sustained for over the seconds - MARK as read.
    setTimeout(() => {
      if (dayjs().diff(chatUserIDLastChange, 'milliseconds') >= 3000) {
        const newChat = rootStore.chats.findChat(+(rootStore.view.id || ''))
        if (!!newChat?.unreadCount) {
          newChat?.sendReadConfirmation()
          newChat?.setAllMessagesRead()
        }
      }
    }, 3000)
  })
}
