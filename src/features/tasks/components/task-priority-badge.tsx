import { Circle } from 'lucide-react'
import { Badge } from '../../../components/ui/badge.tsx'
import type { TaskPriority } from '../types/task-types.ts'

const priorityLabels: Record<TaskPriority, string> = {
  high: 'High',
  low: 'Low',
  medium: 'Medium',
  urgent: 'Urgent',
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <Badge tone={priority}>
      <Circle aria-hidden="true" fill="currentColor" size={9} strokeWidth={0} />
      {priorityLabels[priority]}
    </Badge>
  )
}
