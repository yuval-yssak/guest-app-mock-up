import React from 'react'
import ReactDOM from 'react-dom'
import { getSnapshot } from 'mobx-state-tree'
import { RootStore } from './models/RootStore'
import { Provider } from './models/reactHook'
import App from './components/App'
import onStart from './onStart'
import defaultStore from './defaultStore'

const rootElement = document.getElementById('root')

let rootStore = RootStore.create(defaultStore as any)

;(window as any).store = rootStore

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
      ;(window as any).store = rootStore = RootStore.create(
        getSnapshot(rootStore)
      )
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
