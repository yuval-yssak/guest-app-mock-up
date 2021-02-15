import React from 'react'
import { observer } from 'mobx-react-lite'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import { useMst } from '../models/reactHook'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

const ActionableSnackbar = styled(Snackbar)`
  cursor: pointer;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`

function AnnouncementSnackbar() {
  const store = useMst()
  const importantUnread = store.announcements.unread.filter(
    a => a.priority === 'high'
  ).length

  return (
    <ActionableSnackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={!!store.announcements.snackbar}
      onClick={() => {
        store.view.openAnnouncementsPage()
      }}
      message={`${importantUnread} new important announcement${
        importantUnread > 1 ? 's' : ''
      }`}
      key={uuidv4()}
      action={
        <Button size="small" variant="contained">
          See details
        </Button>
      }
    />
  )
}

export default observer(AnnouncementSnackbar)
