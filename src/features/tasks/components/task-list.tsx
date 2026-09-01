import { CalendarDays, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appRoutes } from '../../../lib/navigation.ts'
import type { Task, TaskStatus, TeamMember } from '../types/task-types.ts'
import { formatTaskDueDate, isTaskOverdue } from '../utils/task-date-utils.ts'
import { TaskAssignee } from './task-assignee.tsx'
import { TaskPriorityBadge } from './task-priority-badge.tsx'
import { TaskStatusBadge } from './task-status-badge.tsx'

const taskGroups: readonly { label: string; status: TaskStatus }[] = [
  { label: 'To do', status: 'todo' },
  { label: 'In progress', status: 'in-progress' },
  { label: 'Blocked', status: 'blocked' },
  { label: 'Completed', status: 'done' },
]

interface TaskListProps {
  members: readonly TeamMember[]
  tasks: readonly Task[]
}

function TaskDueDate({ task }: { task: Task }) {
  const isOverdue = isTaskOverdue(task)

  return (
    <span className={isOverdue ? 'task-due-date task-due-date--overdue' : 'task-due-date'}>
      <CalendarDays aria-hidden="true" size={15} />
      {formatTaskDueDate(task.dueDate)}
    </span>
  )
}

export function TaskList({ members, tasks }: TaskListProps) {
  const membersById = new Map(members.map((member) => [member.id, member]))

  return (
    <section aria-label="Tasks" className="task-list">
      <div className="task-table">
        <table>
          <caption className="sr-only">Task list</caption>
          <thead>
            <tr>
              <th scope="col">Task name</th>
              <th scope="col">Description</th>
              <th scope="col">Priority</th>
              <th scope="col">Due date</th>
              <th scope="col">Status</th>
              <th scope="col">Owner</th>
            </tr>
          </thead>
          {taskGroups.map(({ label, status }) => {
            const groupedTasks = tasks.filter((task) => task.status === status)

            if (!groupedTasks.length) {
              return null
            }

            return (
              <tbody key={status}>
                <tr className={`task-table__group task-table__group--${status}`}>
                  <th colSpan={6} scope="rowgroup">
                    <span aria-hidden="true" className="task-table__group-dot" />
                    {label} <span>· {groupedTasks.length}</span>
                  </th>
                </tr>
                {groupedTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="task-table__title-cell">
                      <Link className="task-title-link" to={appRoutes.taskDetails(task.id)}>{task.title}</Link>
                    </td>
                    <td className="task-table__description-cell">
                      <p className="task-table__description">{task.description ?? 'No description'}</p>
                    </td>
                    <td><TaskPriorityBadge priority={task.priority} /></td>
                    <td><TaskDueDate task={task} /></td>
                    <td><TaskStatusBadge status={task.status} /></td>
                    <td><TaskAssignee assignee={task.assigneeId ? membersById.get(task.assigneeId) : undefined} /></td>
                  </tr>
                ))}
              </tbody>
            )
          })}
        </table>
      </div>

      <ul className="task-card-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link className="task-card" to={appRoutes.taskDetails(task.id)}>
              <div className="task-card__heading">
                <h2>{task.title}</h2>
                <ChevronRight aria-hidden="true" className="task-card__chevron" size={18} />
              </div>
              <div className="task-card__badges">
                <TaskPriorityBadge priority={task.priority} />
                <TaskStatusBadge status={task.status} />
              </div>
              <div className="task-card__details">
                <TaskAssignee assignee={task.assigneeId ? membersById.get(task.assigneeId) : undefined} />
                <TaskDueDate task={task} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
