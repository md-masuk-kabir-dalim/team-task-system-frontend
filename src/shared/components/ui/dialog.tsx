import { X } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'
import { useControlledDialog } from '@/shared/hooks/use-controlled-dialog.ts'
import { IconButton } from './icon-button.tsx'

interface DialogProps {
  children: ReactNode
  description?: string
  footer?: ReactNode
  onClose: () => void
  open: boolean
  title: string
}

export function Dialog({ children, description, footer, onClose, open, title }: DialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const { dialogRef, handleBackdropClick, handleCancel } = useControlledDialog(open, onClose)

  return (
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className="dialog"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <section className="dialog__content">
        <header className="dialog__header">
          <div>
            <h2 className="dialog__title" id={titleId}>{title}</h2>
            {description ? <p className="dialog__description" id={descriptionId}>{description}</p> : null}
          </div>
          <IconButton label={`Close ${title}`} onClick={onClose} variant="ghost">
            <X aria-hidden="true" size={20} />
          </IconButton>
        </header>
        <div className="dialog__body">{children}</div>
        {footer ? <footer className="dialog__footer">{footer}</footer> : null}
      </section>
    </dialog>
  )
}
