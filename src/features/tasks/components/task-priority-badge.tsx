import { Flag } from 'lucide-react'
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
      <Flag aria-hidden="true" size={12} strokeWidth={2.2} />
      {priorityLabels[priority]}
    </Badge>
  )
}
