import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn.ts'

type SkeletonShape = 'circle' | 'line' | 'rectangle'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape
}

export function Skeleton({ className, shape = 'rectangle', ...props }: SkeletonProps) {
  return <div {...props} aria-hidden="true" className={cn('skeleton', `skeleton--${shape}`, className)} />
}
