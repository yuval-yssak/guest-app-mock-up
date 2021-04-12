import React from 'react'
import { observer } from 'mobx-react-lite'
import Button from '@material-ui/core/Button'
import { useMst } from '../models/reactHook'
import { useSnackbar, VariantType } from 'notistack'
import { values } from 'mobx'
import { WarningType } from '../models/WarningModel'

function WarningsNotifier() {
  const [displayedKeys, setDisplayedKeys] = React.useState([''])
  const store = useMst()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const synchronizeSnackbars = React.useCallback(
    (warning: WarningType) => {
      if (warning.dismissed) {
        closeSnackbar(warning.key)
      } else if (!displayedKeys.includes(warning.key)) {
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
          variant: [
            'default',
            'error',
            'warning',
            'info',
            'success'
          ][0] as VariantType, // ][Math.floor(Math.random() * 5)] as VariantType,
          onExited: () => {
            store.warnings.dismissOne(warning.key)
            setDisplayedKeys(
              displayedKeys.filter(displayedKey => displayedKey !== warning.key)
            )
          },
          autoHideDuration: warning.autoHideDuration,
          action,
          key: warning.key
        })
        setDisplayedKeys(displayedKeys.concat(warning.key))
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
