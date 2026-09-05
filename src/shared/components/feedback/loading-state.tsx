interface LoadingStateProps {
  context?: 'inline' | 'page' | 'section'
  message?: string
}

export function LoadingState({ context = 'section', message = 'Loading content' }: LoadingStateProps) {
  return (
    <div aria-live="polite" className={`feedback-state feedback-state--loading feedback-state--${context}`} role="status">
      <span aria-hidden="true" className="loading-indicator" />
      <span>{message}</span>
    </div>
  )
}
