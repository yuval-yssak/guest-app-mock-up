import React from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../models/reactHook'
import AdminRegistrationsView from './AdminRegistrationsView'
import RegistrationsList from './RegistrationsList'
import PersonDetails from './PersonDetails'
import { DataGridContainer } from '../../components/common/DataGrid/DataGrid'

function RegistrationsEntry() {
  const store = useMst()
  return (
    <>
      {store.view.page === '/registrations' && store.view.id && (
        <PersonDetails id={+store.view.id} />
      )}
      {store.view.page === '/registrations' && !store.view.id && (
        <AdminRegistrationsView />
      )}
      {store.view.page.match(/^\/registrations\/.+/) && (
        <DataGridContainer>
          <RegistrationsList
            filter={store.view.page.replace(/^\/registrations\//, '')}
          />
        </DataGridContainer>
      )}
    </>
  )
}

export default observer(RegistrationsEntry)
