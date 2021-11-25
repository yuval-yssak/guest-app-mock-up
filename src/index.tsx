import React from 'react'
import ReactDOM from 'react-dom'
import { getSnapshot, applySnapshot } from 'mobx-state-tree'
import { RootStore, RootStoreType } from './models/RootStore'
import { Provider } from './models/reactHook'
import App from './components/App'
import onStart from './onStart'
import defaultStore from './defaultStore'

const rootElement = document.getElementById('root')

let rootStore = RootStore.create()
applySnapshot(rootStore, defaultStore)
;(window as unknown as Window & { store: RootStoreType }).store = rootStore

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <Provider value={rootStore}>
        <App />
      </Provider>
    </React.StrictMode>,
    rootElement
  )
}

try {
  render()

  if (module.hot) {
    module.hot.accept(['./models/RootStore'], () => {
      // Store definition changed, recreate a new one from old state
      ;(
        window as unknown as Window & {
          store: RootStoreType
        }
      ).store = rootStore = RootStore.create(getSnapshot(rootStore))
    })

    module.hot.accept(['./components/App'], () => {
      // Componenent definition changed, re-render app
      render()
    })
  }
} catch (e) {
  console.error(e)
  localStorage.clear()
  render()
}

onStart(rootStore)
rootStore.view.openChatPage()
