import React from 'react'
import { observer } from 'mobx-react-lite'
import Snackbar from '@material-ui/core/Snackbar'
import { useMst } from '../models/reactHook'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

const ActionableSnackbar = styled(Snackbar)`
  cursor: pointer;
`

function AnnouncementSnackbar() {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const store = useMst()

  return (
    <ActionableSnackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={!!store.announcements.snackbar}
      onClick={() => {
        store.view.openAnnouncementsPage()
        // store.announcements.clearSnackbar()
      }}
      message={store.announcements.snackbar}
      key={uuidv4()}
    />
  )
}

export default observer(AnnouncementSnackbar)
