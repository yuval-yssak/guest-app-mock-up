import React from 'react'
import ReactDOM from 'react-dom'
import { getSnapshot } from 'mobx-state-tree'
import { Store } from './models/Store'
import { Provider } from './models/reactHook'
import App from './components/App'
import onStart from './onStart'
import defaultStore from './defaultStore'

const rootElement = document.getElementById('root')

let rootStore = Store.create(defaultStore)

window.store = rootStore

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
    module.hot.accept(['./models/Store'], () => {
      // Store definition changed, recreate a new one from old state
      window.store = rootStore = Store.create(getSnapshot(rootStore))
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
