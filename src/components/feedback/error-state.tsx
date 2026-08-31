import { Button } from '../ui/button.tsx'

interface ErrorStateProps {
  description: string
  onRetry?: () => void
  retryLabel?: string
  title?: string
}

export function ErrorState({
  description,
  onRetry,
  retryLabel = 'Try again',
  title = 'Unable to load this content',
}: ErrorStateProps) {
  return (
    <section aria-live="assertive" className="feedback-state feedback-state--error" role="alert">
      <p className="feedback-state__eyebrow">Something went wrong</p>
      <h2 className="feedback-state__title">{title}</h2>
      <p className="feedback-state__description">{description}</p>
      {onRetry ? <Button onClick={onRetry} variant="secondary">{retryLabel}</Button> : null}
    </section>
  )
}
