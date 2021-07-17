import React from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../models/reactHook'
import AdminRegistrationsView from './AdminRegistrationsView'
import RegistrationsList from './RegistrationsList'
import PersonDetails from './PersonDetails'
import styled from 'styled-components'
import PageContentWrapper from '../../components/PageContentWrapper'

const DataGridContainer = styled(PageContentWrapper)`
  && {
    align-content: start;
    align-items: stretch;
    grid-template-rows: unset;
    grid-template-columns: unset;
    justify-content: center;
    height: 100%;
    max-width: 100%;
    overflow-y: hidden;
    padding: 2rem 0;
    width: clamp(45rem, 90%, 109rem);

    @media (max-height: 31em) {
      padding: 0;
    }
  }
`

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
