import { CircleCheck } from 'lucide-react'
import { Badge } from '../../../components/ui/badge.tsx'
import type { TaskStatus } from '../types/task-types.ts'

const statusLabels: Record<TaskStatus, string> = {
  blocked: 'Blocked',
  done: 'Done',
  'in-progress': 'In progress',
  todo: 'To do',
}

interface TaskStatusBadgeProps {
  status: TaskStatus
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge tone={status}>
      {status === 'done' ? <CircleCheck aria-hidden="true" size={13} strokeWidth={2.2} /> : null}
      {statusLabels[status]}
    </Badge>
  )
}
