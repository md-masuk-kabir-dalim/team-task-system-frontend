import type { ReactNode } from 'react'

interface EmptyStateProps {
  action?: ReactNode
  description: string
  title: string
}

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <section className="feedback-state feedback-state--empty">
      <p className="feedback-state__eyebrow">Nothing here yet</p>
      <h2 className="feedback-state__title">{title}</h2>
      <p className="feedback-state__description">{description}</p>
      {action ? <div className="feedback-state__action">{action}</div> : null}
    </section>
  )
}
