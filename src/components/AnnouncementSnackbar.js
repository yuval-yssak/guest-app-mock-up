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

  // Material UI has the snakbar taking all with available width
  // below 600px, using flex-grow: initial. In this case,
  // we want the snackbar to take part of the layout and not to
  // block any other element.
  @media (max-width: 599px) {
    && {
      position: static;
    }
  }
`

function AnnouncementSnackbar() {
  const store = useMst()
  const [initialDelay, setInitialDelay] = React.useState(true)

  React.useEffect(() => {
    const timeoutObject = setTimeout(() => {
      setInitialDelay(false)
    }, 15_000)
    return () => clearTimeout(timeoutObject)
  }, [])

  const importantUnreadCount = store.announcements.unread.filter(
    a => a.priority === 'high'
  ).length

  return (
    <ActionableSnackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={!!store.announcements.snackbar && !initialDelay}
      onClick={() => {
        store.view.openAnnouncementsPage()
      }}
      message={`${importantUnreadCount} new important announcement${
        importantUnreadCount > 1 ? 's' : ''
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
