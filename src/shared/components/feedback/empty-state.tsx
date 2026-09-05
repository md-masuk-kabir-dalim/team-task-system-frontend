import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  primaryAction?: ReactNode
  secondaryAction?: ReactNode
  description: string
  title: string
}

export function EmptyState({ description, icon, primaryAction, secondaryAction, title }: EmptyStateProps) {
  return (
    <section className="feedback-state feedback-state--empty">
      {icon ? <div className="feedback-state__icon">{icon}</div> : null}
      <p className="feedback-state__eyebrow">Nothing here yet</p>
      <h2 className="feedback-state__title">{title}</h2>
      <p className="feedback-state__description">{description}</p>
      {primaryAction || secondaryAction ? (
        <div className="feedback-state__action">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  )
}
