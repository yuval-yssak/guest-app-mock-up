import { reaction, autorun } from 'mobx'

export default function onStart(rootStore) {
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
  window.onpopstate = function historyChange(ev) {
    if (ev.type === 'popstate') rootStore.view.setFromURL()
  }
}
