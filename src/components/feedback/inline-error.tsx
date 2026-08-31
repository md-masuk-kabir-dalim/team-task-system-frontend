import { CircleAlert } from 'lucide-react'

interface InlineErrorProps {
  message: string
}

export function InlineError({ message }: InlineErrorProps) {
  return (
    <p className="inline-error" role="alert">
      <CircleAlert aria-hidden="true" size={16} />
      <span>{message}</span>
    </p>
  )
}
