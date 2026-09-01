import { Avatar } from '../../../components/ui/avatar.tsx'
import type { TeamMember } from '../types/task-types.ts'

interface TaskAssigneeProps {
  assignee: TeamMember | undefined
}

export function TaskAssignee({ assignee }: TaskAssigneeProps) {
  if (!assignee) {
    return <span className="task-assignee task-assignee--unassigned">Unassigned</span>
  }

  return (
    <span className="task-assignee">
      <Avatar {...(assignee.avatarUrl ? { src: assignee.avatarUrl } : {})} name={assignee.name} size="sm" />
      <span className="task-assignee__name">{assignee.name}</span>
    </span>
  )
}
