import React from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../models/reactHook'
import AdminPeopleView from './AdminPeopleView'
import PeopleList from './PeopleList'
import PersonDetails from './PersonDetails'

function PeopleEntry() {
  const store = useMst()
  return (
    <>
      {store.view.page === '/people' && store.view.id && (
        <PersonDetails id={+store.view.id} />
      )}
      {store.view.page === '/people' && !store.view.id && <AdminPeopleView />}
      {store.view.page.match(/^\/people\/.+/) && (
        <PeopleList filter={store.view.page.replace(/^\/people\//, '')} />
      )}
    </>
  )
}

export default observer(PeopleEntry)
