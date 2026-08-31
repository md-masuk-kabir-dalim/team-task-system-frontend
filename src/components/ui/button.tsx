import { LoaderCircle } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  disabled,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      className={cn('button', `button--${variant}`, `button--${size}`, className)}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="button__spinner" size={16} /> : null}
      <span className="button__content">{children}</span>
    </button>
  )
}
