import React from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import PageContentWrapper from '../../components/PageContentWrapper'
import { useMst } from '../../models/reactHook'
import AdminPeopleView from './AdminPeopleView'
import PeopleList from './PeopleList'
import PersonDetails from './PersonDetails'

const ScrollablePageContentWrapper = styled(PageContentWrapper).attrs({
  className: 'scrollable'
})`
  && {
    overflow-y: scroll;
    align-items: start;
    padding-top: 2rem;
    grid-template-rows: unset;
    grid-auto-rows: max-content;
  }
`

function PeopleEntry() {
  const store = useMst()
  console.log('rendering,', store.view.page, store.view.id)
  return (
    <ScrollablePageContentWrapper role="article">
      {store.view.page === '/people' && store.view.id && (
        <PersonDetails id={+store.view.id} />
      )}
      {store.view.page === '/people' && !store.view.id && <AdminPeopleView />}
      {store.view.page.match(/^\/people\/.+/) && (
        <PeopleList filter={store.view.page.replace(/^\/people\//, '')} />
      )}
    </ScrollablePageContentWrapper>
  )
}

export default observer(PeopleEntry)
