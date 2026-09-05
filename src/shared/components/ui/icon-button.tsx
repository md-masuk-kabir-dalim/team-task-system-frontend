import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/shared/lib/cn.ts'

type IconButtonVariant = 'ghost' | 'secondary'

interface IconButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string
  variant?: IconButtonVariant
}

export function IconButton({
  children,
  className,
  label,
  type = 'button',
  variant = 'ghost',
  ...props
}: IconButtonProps) {
  return (
   <button
        {...props}
        aria-label={label}
        className={cn('icon-button', `icon-button--${variant}`, className)}
        type={type}
      >
        {children}
      </button>
  )
}
