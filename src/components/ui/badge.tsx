import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn.ts'

type BadgeTone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'status-todo'
  | 'status-in-progress'
  | 'status-blocked'
  | 'status-done'
  | 'priority-low'
  | 'priority-medium'
  | 'priority-high'
  | 'priority-urgent'

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
