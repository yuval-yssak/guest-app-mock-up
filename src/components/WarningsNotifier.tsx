/* The logic here is overly complex. Can be simplified if turns out to be buggy */

import React from 'react'
import { observer } from 'mobx-react-lite'
import Button from '@material-ui/core/Button'
import { useMst } from '../models/reactHook'
import { useSnackbar } from 'notistack'
import { values } from 'mobx'
import { WarningType } from '../models/WarningModel'

function WarningsNotifier() {
  const displayedKeys = React.useRef<{ key: string; message: string }[]>([])
  const store = useMst()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const synchronizeSnackbars = React.useCallback(
    (warning: WarningType) => {
      // close any displayed warning which is not in the store.
      displayedKeys.current
        .filter(
          displayed =>
            !((values(store.warnings.list) as unknown) as WarningType[]).some(
              warning => warning.key === displayed.key
            )
        )
        .forEach(displayed => closeSnackbar(displayed.key))

      // notice what has changed and update accordingly.
      if (warning.dismissed) {
        closeSnackbar(warning.key)
      } else if (
        displayedKeys.current.find(
          displayed =>
            displayed.key === warning.key &&
            displayed.message !== warning.message
        )
      ) {
        // replace the warning
        displayedKeys.current = displayedKeys.current.filter(
          displayed => displayed.key !== warning.key
        )
        closeSnackbar(warning.key)
        // wait for the previous snackbar to close
        setTimeout(() => synchronizeSnackbars(warning), 1000)
      } else if (
        displayedKeys.current.find(
          displayed =>
            displayed.key === warning.key &&
            displayed.message === warning.message
        )
      ) {
      } else {
        // new warning
        const action = warning.action ? (
          <Button
            onClick={() => warning.performAction()}
            size="small"
            variant="contained"
          >
            {warning.action.actionText}
          </Button>
        ) : undefined
        enqueueSnackbar(warning.message, {
          variant: 'default',
          onExited: () => {
            store.warnings.dismissOne(warning.key)
            displayedKeys.current = displayedKeys.current.filter(
              displayedKey => displayedKey.key !== warning.key
            )
          },
          autoHideDuration: warning.autoHideDuration,
          action,
          key: warning.key
        })
        displayedKeys.current = displayedKeys.current.concat({
          key: warning.key,
          message: warning.message
        })
      }
    },
    [closeSnackbar, enqueueSnackbar, store.warnings, displayedKeys]
  )

  React.useEffect(() => {
    // unresolved typescript problem https://github.com/mobxjs/mobx/issues/2422
    ;((values(store.warnings.list) as unknown) as WarningType[]).forEach(
      synchronizeSnackbars
    )
  }, [
    store,
    store.warnings.warningUpdateCounter,
    enqueueSnackbar,
    closeSnackbar,
    synchronizeSnackbars
  ])

  return null
}

export default observer(WarningsNotifier)
