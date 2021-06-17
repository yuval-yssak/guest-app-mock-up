/**
 * Synchronizes the warnings in the store with the enqueued snackbars.
 *
 * Relies on store.warnings.warningUpdateCounter being updated whenever any
 * chnage to the warnings is made within the store.
 *
 * A warning can change its message while still keeping the same key.
 * When it does - it gets closed and enqueued again.
 * This is handled by design implicitly. See comments below.
 */

import { observer } from 'mobx-react-lite'
// import Button from '@material-ui/core/Button'
import { useMst } from '../models/reactHook'
// import { useSnackbar, ProviderContext } from 'notistack'
import { reaction } from 'mobx'
// import { RootStoreType } from '../models/RootStore'
// import { v4 as uuidv4 } from 'uuid'

// const queuedWarnings: {
//   storeKey: string
//   enqueuedKey: string
//   message: string
// }[] = []

// function syncWarningsWithStore(
//   // { enqueueSnackbar, closeSnackbar }: ProviderContext,
//   store: RootStoreType
// ) {
//   const storeWarnings = store.warnings.list()

//   // handle removed warnings
//   const removedWarnings = queuedWarnings.filter(
//     queuedWarning =>
//       !storeWarnings
//         .filter(w => !w.dismissed)
//         .some(
//           storeWarning =>
//             storeWarning.key === queuedWarning.storeKey &&
//             // compare message content alongside the key.
//             // If any changes - the current snackbar will be closed.
//             storeWarning.message === queuedWarning.message
//         )
//   )
//   removedWarnings.forEach(removedWarning => {

//     // closeSnackbar(removedWarning.enqueuedKey)
//     // queuedWarnings.splice(
//     //   queuedWarnings.findIndex(
//     //     queuedWarning =>
//     //       queuedWarning.enqueuedKey === removedWarning.enqueuedKey
//     //   ),
//     //   1
//     // )

//   })

//   // handle added warnings

//   // in case a message was altered, the previous snackbar has been closed,
//   // so it will reappear as an unqueued warning here:
//   const unqueuedWarnings = storeWarnings
//     .filter(w => !w.dismissed)
//     .filter(
//       storeWarning =>
//         !queuedWarnings.some(
//           queuedWarning => storeWarning.key === queuedWarning.storeKey
//         )
//     )
//   unqueuedWarnings.forEach(unqueuedWarning => {
//     const action = unqueuedWarning.action ? (
//       <Button
//         onClick={() => unqueuedWarning.performAction(store)}
//         size="small"
//         variant="contained"
//       >
//         {unqueuedWarning.action.actionText}
//       </Button>
//     ) : undefined

//     const enqueuedKey = uuidv4()

//     // keep a unique key separate from the one in the store to allow multiple
//     // warnings to issued in parallel.
//     // This is needed since after closing a snackbar in notistack, there is an
//     // approximately one second delay before being allowed to enqueue another
//     // snackbar with the same key.
//     queuedWarnings.push({
//       storeKey: unqueuedWarning.key,
//       enqueuedKey,
//       message: unqueuedWarning.message
//     })

//     // enqueueSnackbar(unqueuedWarning.message, {
//     //   variant: 'default',
//     //   autoHideDuration: unqueuedWarning.autoHideDuration,
//     //   action,
//     //   key: enqueuedKey
//     // })
//   })
// }

function WarningsNotifier() {
  const store = useMst()

  // const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  reaction(
    () => store.warnings.list(),
    () => {
      // syncWarningsWithStore({ enqueueSnackbar, closeSnackbar }, store)
    }
  )

  return null
}

export default observer(WarningsNotifier)
