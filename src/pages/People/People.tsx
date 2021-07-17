import React from 'react'
import { observer } from 'mobx-react-lite'
import { useMst } from '../../models/reactHook'
import AdminPeopleView from './AdminPeopleView'
import PeopleList from './PeopleList'
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

function PeopleEntry() {
  const store = useMst()
  return (
    <>
      {store.view.page === '/people' && store.view.id && (
        <PersonDetails id={+store.view.id} />
      )}
      {store.view.page === '/people' && !store.view.id && <AdminPeopleView />}
      {store.view.page.match(/^\/people\/.+/) && (
        <DataGridContainer>
          <PeopleList filter={store.view.page.replace(/^\/people\//, '')} />
        </DataGridContainer>
      )}
    </>
  )
}

export default observer(PeopleEntry)
