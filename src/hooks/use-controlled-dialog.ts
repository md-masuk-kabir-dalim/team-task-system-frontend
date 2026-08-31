import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'

export function useControlledDialog(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

      if (!dialog.open) {
        dialog.showModal()
      }

      return
    }

    if (dialog.open) {
      dialog.close()
      previousFocusRef.current?.focus()
    }
  }, [open])

  const handleCancel = useCallback((event: SyntheticEvent<HTMLDialogElement, Event>) => {
    event.preventDefault()
    onClose()
  }, [onClose])

  const handleBackdropClick = useCallback((event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }, [onClose])

  return { dialogRef, handleBackdropClick, handleCancel }
}
