import type { ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <span className="tooltip">
      <span className="tooltip__trigger">{children}</span>
      <span className="tooltip__content" role="tooltip">{content}</span>
    </span>
  )
}
