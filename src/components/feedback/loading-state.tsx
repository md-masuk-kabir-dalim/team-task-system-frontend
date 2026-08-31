interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading content' }: LoadingStateProps) {
  return (
    <div aria-live="polite" className="feedback-state feedback-state--loading" role="status">
      <span aria-hidden="true" className="loading-indicator" />
      <span>{message}</span>
    </div>
  )
}
