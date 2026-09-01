import { CalendarDays, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appRoutes } from '../../../lib/navigation.ts'
import { useTaskUiStore } from '../../../stores/task-ui-store.ts'
import type { Task, TaskStatus, TeamMember } from '../types/task-types.ts'
import { formatTaskDueDate } from '../utils/task-date-utils.ts'
import { TaskAssignee } from './task-assignee.tsx'
import { TaskPriorityBadge } from './task-priority-badge.tsx'

const boardColumns: readonly { label: string; status: TaskStatus }[] = [
  { label: 'To do', status: 'todo' },
  { label: 'In progress', status: 'in-progress' },
  { label: 'Blocked', status: 'blocked' },
  { label: 'Completed', status: 'done' },
]

interface TaskBoardProps {
  members: readonly TeamMember[]
  tasks: readonly Task[]
}

export function TaskBoard({ members, tasks }: TaskBoardProps) {
  const membersById = new Map(members.map((member) => [member.id, member]))
  const openCreateTask = useTaskUiStore((state) => state.openCreateTask)

  return (
    <section aria-label="Kanban task board" className="task-board">
      {boardColumns.map(({ label, status }) => {
        const columnTasks = tasks.filter((task) => task.status === status)

        return (
          <section className={`task-board__column task-board__column--${status}`} key={status}>
            <header className="task-board__column-header">
              <div>
                <span aria-hidden="true" className="task-board__status-dot" />
                <h2>{label}</h2>
                <span className="task-board__count">{String(columnTasks.length).padStart(2, '0')}</span>
              </div>
              <button aria-label={`Add a ${label.toLocaleLowerCase()} task`} className="task-board__add" onClick={openCreateTask} type="button">
                <Plus aria-hidden="true" size={19} />
              </button>
            </header>
            <div className="task-board__cards">
              {columnTasks.length ? columnTasks.map((task) => (
                <Link className="task-board-card" key={task.id} to={appRoutes.taskDetails(task.id)}>
                  <TaskPriorityBadge priority={task.priority} />
                  <h3>{task.title}</h3>
                  <p>{task.description ?? 'No additional description was added.'}</p>
                  <footer>
                    <span><CalendarDays aria-hidden="true" size={15} />{formatTaskDueDate(task.dueDate)}</span>
                    <TaskAssignee assignee={task.assigneeId ? membersById.get(task.assigneeId) : undefined} />
                  </footer>
                </Link>
              )) : <p className="task-board__empty">No tasks in this stage.</p>}
            </div>
          </section>
        )
      })}
    </section>
  )
}
