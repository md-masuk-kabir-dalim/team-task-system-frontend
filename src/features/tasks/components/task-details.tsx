import { CalendarDays, Clock3, UserRound } from 'lucide-react'
import { TaskAssignee } from './task-assignee.tsx'
import { TaskPriorityBadge } from './task-priority-badge.tsx'
import { TaskStatusBadge } from './task-status-badge.tsx'
import { formatTaskDueDate, isTaskOverdue } from '../utils/task-date-utils.ts'
import type { Task, TeamMember } from '../types/task-types.ts'

interface TaskDetailsProps {
  members: readonly TeamMember[]
  task: Task
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

export function TaskDetails({ members, task }: TaskDetailsProps) {
  const assignee = task.assigneeId ? members.find((member) => member.id === task.assigneeId) : undefined
  const isOverdue = isTaskOverdue(task)

  return (
    <article className="task-details">
      <div className="task-details__heading">
        <div className="task-details__badges">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>
        <h1>{task.title}</h1>
        <p>{task.description ?? 'No description was added to this task.'}</p>
      </div>

      <dl className="task-details__metadata">
        <div>
          <dt><UserRound aria-hidden="true" size={16} />Assignee</dt>
          <dd><TaskAssignee assignee={assignee} /></dd>
        </div>
        <div>
          <dt><CalendarDays aria-hidden="true" size={16} />Due date</dt>
          <dd className={isOverdue ? 'task-details__overdue' : undefined}>{formatTaskDueDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt><Clock3 aria-hidden="true" size={16} />Created</dt>
          <dd>{formatTimestamp(task.createdAt)}</dd>
        </div>
        <div>
          <dt><Clock3 aria-hidden="true" size={16} />Updated</dt>
          <dd>{formatTimestamp(task.updatedAt)}</dd>
        </div>
      </dl>
    </article>
  )
}
