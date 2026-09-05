import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn.ts'

type BadgeTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'done'
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export function Badge({ children, className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span {...props} className={cn('badge', `badge--${tone}`, className)}>
      {children}
    </span>
  )
}
