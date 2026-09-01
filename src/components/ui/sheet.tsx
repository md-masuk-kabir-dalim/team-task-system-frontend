import { X } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'
import { useControlledDialog } from '../../hooks/use-controlled-dialog.ts'
import { IconButton } from './icon-button.tsx'

type SheetSide = 'bottom' | 'right'

interface SheetProps {
  children: ReactNode
  description?: string
  footer?: ReactNode
  id?: string
  onClose: () => void
  open: boolean
  side?: SheetSide
  title: string
}

export function Sheet({ children, description, footer, id, onClose, open, side = 'right', title }: SheetProps) {
  const titleId = useId()
  const descriptionId = useId()
  const { dialogRef, handleBackdropClick, handleCancel } = useControlledDialog(open, onClose)

  return (
    <dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      className={`sheet sheet--${side}`}
      id={id}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <section className="sheet__content">
        <header className="sheet__header">
          <div>
            <h2 className="sheet__title" id={titleId}>{title}</h2>
            {description ? <p className="sheet__description" id={descriptionId}>{description}</p> : null}
          </div>
          <IconButton label="" onClick={onClose} variant="ghost">
            <X aria-hidden="true" size={20} />
          </IconButton>
        </header>
        <div className="sheet__body">{children}</div>
        {footer ? <footer className="sheet__footer">{footer}</footer> : null}
      </section>
    </dialog>
  )
}
