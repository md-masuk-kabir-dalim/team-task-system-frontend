import { LoaderCircle } from 'lucide-react'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn.ts'

type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  isLoading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      aria-busy={isLoading || undefined}
      className={cn('button', `button--${variant}`, `button--${size}`, className)}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading ? <LoaderCircle aria-hidden="true" className="button__spinner" size={16} /> : null}
      <span className="button__content">{children}</span>
    </button>
  )
}
