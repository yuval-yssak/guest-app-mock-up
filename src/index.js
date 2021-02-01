import React from 'react'
import ReactDOM from 'react-dom'
import { getSnapshot } from 'mobx-state-tree'
import { Store } from './models/Store'
import { Provider } from './models/reactHook'
import App from './components/App'
import onStart from './onStart'

const rootElement = document.getElementById('root')

let rootStore = Store.create()

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
    console.log('module hot')
    module.hot.accept(['./models/View'], () => {
      // Store definition changed, recreate a new one from old state
      window.store = rootStore = Store.create(getSnapshot(rootStore))
    })

    module.hot.accept(['./components/App'], () => {
      console.log('accept')
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
