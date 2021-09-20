import React from 'react'
import { Column } from 'react-table'
import {
  DataGridContainer,
  ScrollableDataGrid
} from '../../components/common/DataGrid/DataGrid'
import { PrimaryButton, SecondaryButton } from '../../components/common/Buttons'
import { useMst } from '../../models/reactHook'
import { Announcement } from '../AnnouncementsPage'

type AnnouncementStatsRow = {
  name: string
  id: string
  readTimestamp: string
}

const readConfirmationListColumns = [
  {
    Header: 'Name',
    accessor: 'name'
  },
  {
    Header: 'id',
    accessor: 'id'
  },
  { Header: 'Read?', accessor: 'readTimestamp' }
] as Column<AnnouncementStatsRow>[]

export function AnnouncementStats() {
  const store = useMst()
  const columns = React.useMemo(() => readConfirmationListColumns, [])

  // todo - it is not really guaranteed that there is such an announcement...
  const announcement = store.announcements.announcementById(store.view.id!)

  if (!announcement)
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '1rem 0.5rem' }}>Announcement not found</div>
        <SecondaryButton onClick={() => store.view.openAnnouncementsPage()}>
          Back to Announcements
        </SecondaryButton>
      </div>
    )

  const data =
    announcement?.admin?.stats.readStatistics.map<AnnouncementStatsRow>(s => ({
      id: s.readBy.id.toString(),
      name: s.readBy.personName,
      readTimestamp: s.timestamp.toISOString()
    }))

  if (!data)
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '1rem 0.5rem' }}>
          Announcement stats not found
        </div>
        <SecondaryButton onClick={() => store.view.openAnnouncementsPage()}>
          Back to Announcements
        </SecondaryButton>
      </div>
    )

  return (
    <DataGridContainer>
      <Announcement announcement={announcement} />
      <ScrollableDataGrid
        columns={columns}
        data={data}
        nonSortable={false}
        disableResize={false}
        withGlobalFilter={true}
        renderButtons={() => (
          <PrimaryButton onClick={() => store.view.openAnnouncementsPage()}>
            Back
          </PrimaryButton>
        )}
      />
    </DataGridContainer>
  )
}
