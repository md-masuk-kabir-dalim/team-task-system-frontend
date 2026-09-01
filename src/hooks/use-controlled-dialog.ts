import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, SyntheticEvent } from 'react'

const closeAnimationDuration = 220

export function useControlledDialog(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      globalThis.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open) {
      clearCloseTimeout()
      delete dialog.dataset.closing

      if (!dialog.open) {
        previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        dialog.showModal()
      }

      return
    }

    if (dialog.open) {
      dialog.dataset.closing = 'true'
      clearCloseTimeout()
      closeTimeoutRef.current = globalThis.setTimeout(() => {
        dialog.close()
        delete dialog.dataset.closing
        previousFocusRef.current?.focus()
        closeTimeoutRef.current = null
      }, closeAnimationDuration)
    }
  }, [clearCloseTimeout, open])

  useEffect(() => clearCloseTimeout, [clearCloseTimeout])

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
