import { CalendarDays, Plus } from 'lucide-react'
import { useState } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { InlineError } from '../../../components/feedback/inline-error.tsx'
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
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>
  tasks: readonly Task[]
}

export function TaskBoard({ members, onStatusChange, tasks }: TaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, TaskStatus>>({})
  const membersById = new Map(members.map((member) => [member.id, member]))
  const openCreateTask = useTaskUiStore((state) => state.openCreateTask)
  const boardTasks = tasks.map((task) => {
    const optimisticStatus = statusOverrides[task.id]
    return optimisticStatus ? { ...task, status: optimisticStatus } : task
  })

  const moveTask = async (taskId: string, status: TaskStatus) => {
    const task = boardTasks.find((candidate) => candidate.id === taskId)

    if (!task || task.status === status || pendingTaskId) {
      return
    }

    setMoveError(null)
    setPendingTaskId(taskId)
    setStatusOverrides((currentOverrides) => ({ ...currentOverrides, [taskId]: status }))

    try {
      await onStatusChange(taskId, status)
    } catch (error: unknown) {
      setStatusOverrides((currentOverrides) => {
        const nextOverrides = { ...currentOverrides }
        delete nextOverrides[taskId]
        return nextOverrides
      })
      setMoveError(error instanceof Error ? error.message : `Unable to move “${task.title}”. Please try again.`)
    } finally {
      setPendingTaskId(null)
    }
  }

  const handleDragStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
    setDraggedTaskId(taskId)
    setMoveError(null)
  }

  const handleDrop = async (event: DragEvent<HTMLElement>, status: TaskStatus) => {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain') || draggedTaskId
    setDropTarget(null)
    setDraggedTaskId(null)

    if (taskId) {
      await moveTask(taskId, status)
    }
  }

  return (
    <section aria-label="Kanban task board" className="task-board">
      {moveError ? <InlineError message={moveError} /> : null}
      {boardColumns.map(({ label, status }) => {
        const columnTasks = boardTasks.filter((task) => task.status === status)
        const isDropTarget = dropTarget === status && draggedTaskId !== null

        return (
          <section
            className={`task-board__column task-board__column--${status}${isDropTarget ? ' task-board__column--drop-target' : ''}`}
            key={status}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              setDropTarget(status)
            }}
            onDrop={(event) => void handleDrop(event, status)}
          >
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
                <article
                  aria-busy={pendingTaskId === task.id || undefined}
                  className={pendingTaskId === task.id ? 'task-board-card task-board-card--moving' : 'task-board-card'}
                  draggable={pendingTaskId === null}
                  key={task.id}
                  onDragEnd={() => {
                    setDraggedTaskId(null)
                    setDropTarget(null)
                  }}
                  onDragStart={(event) => handleDragStart(event, task.id)}
                >
                  <Link draggable={false} to={appRoutes.taskDetails(task.id)}>
                    <TaskPriorityBadge priority={task.priority} />
                    <h3>{task.title}</h3>
                    <p>{task.description ?? 'No additional description was added.'}</p>
                    <footer>
                      <span><CalendarDays aria-hidden="true" size={15} />{formatTaskDueDate(task.dueDate)}</span>
                      <TaskAssignee assignee={task.assigneeId ? membersById.get(task.assigneeId) : undefined} />
                    </footer>
                  </Link>
                  <label className="task-board-card__move">
                    <span>Move to</span>
                    <select
                      aria-label={`Move ${task.title} to a new status`}
                      disabled={pendingTaskId !== null}
                      onChange={(event) => void moveTask(task.id, event.target.value as TaskStatus)}
                      value={task.status}
                    >
                      {boardColumns.map((column) => <option key={column.status} value={column.status}>{column.label}</option>)}
                    </select>
                  </label>
                </article>
              )) : <p className="task-board__empty">Drop a task here.</p>}
            </div>
          </section>
        )
      })}
    </section>
  )
}
