import { CalendarDays, Plus } from 'lucide-react'
import { useState } from 'react'
import type { DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { InlineError } from '../../../components/feedback/inline-error.tsx'
import { appRoutes } from '../../../lib/navigation.ts'
import { useTaskUiStore } from '../../../stores/task-ui-store.ts'
import type { TaskMoveDestination } from '../api/task-service.ts'
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

interface DropTarget {
  index: number
  status: TaskStatus
}

type ColumnOrderOverrides = Partial<Record<TaskStatus, readonly string[]>>

interface TaskBoardProps {
  members: readonly TeamMember[]
  onTaskMove: (taskId: string, status: TaskStatus, destination: TaskMoveDestination) => Promise<void>
  tasks: readonly Task[]
}

function clampIndex(index: number, maximum: number) {
  return Math.max(0, Math.min(index, maximum))
}

export function TaskBoard({ members, onTaskMove, tasks }: TaskBoardProps) {
  const [columnOrderOverrides, setColumnOrderOverrides] = useState<ColumnOrderOverrides>({})
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, TaskStatus>>({})
  const membersById = new Map(members.map((member) => [member.id, member]))
  const openCreateTask = useTaskUiStore((state) => state.openCreateTask)
  const boardTasks = tasks.map((task) => {
    const optimisticStatus = statusOverrides[task.id]
    return optimisticStatus ? { ...task, status: optimisticStatus } : task
  })

  const getColumnTasks = (status: TaskStatus) => {
    const order = columnOrderOverrides[status]
    const positions = new Map(order?.map((taskId, index) => [taskId, index]))

    return boardTasks
      .filter((task) => task.status === status)
      .toSorted((left, right) => {
        const leftPosition = positions.get(left.id)
        const rightPosition = positions.get(right.id)

        if (leftPosition !== undefined && rightPosition !== undefined) {
          return leftPosition - rightPosition
        }

        if (leftPosition !== undefined) {
          return -1
        }

        if (rightPosition !== undefined) {
          return 1
        }

        return left.position - right.position || left.id.localeCompare(right.id)
      })
  }

  const moveTask = async (
    taskId: string,
    status: TaskStatus,
    destinationIndex: number,
    destination: TaskMoveDestination,
  ) => {
    const task = boardTasks.find((candidate) => candidate.id === taskId)

    if (!task || pendingTaskId) {
      return
    }

    const sourceStatus = task.status
    const sourceTasks = getColumnTasks(sourceStatus)
    const sourceIndex = sourceTasks.findIndex((candidate) => candidate.id === taskId)

    if (sourceIndex === -1) {
      return
    }

    const sourceTasksWithoutMovedTask = sourceTasks.filter((candidate) => candidate.id !== taskId)
    const targetTasks = sourceStatus === status ? sourceTasksWithoutMovedTask : getColumnTasks(status)
    const adjustedIndex = sourceStatus === status && sourceIndex < destinationIndex
      ? destinationIndex - 1
      : destinationIndex
    const targetIndex = clampIndex(adjustedIndex, targetTasks.length)
    const reorderedTargetTasks = [...targetTasks]
    reorderedTargetTasks.splice(targetIndex, 0, { ...task, status })
    const previousStatusOverrides = statusOverrides
    const previousColumnOrders = columnOrderOverrides
    const nextColumnOrders = sourceStatus === status
      ? { ...columnOrderOverrides, [status]: reorderedTargetTasks.map((candidate) => candidate.id) }
      : {
          ...columnOrderOverrides,
          [sourceStatus]: sourceTasksWithoutMovedTask.map((candidate) => candidate.id),
          [status]: reorderedTargetTasks.map((candidate) => candidate.id),
        }

    setMoveError(null)
    setPendingTaskId(taskId)
    setColumnOrderOverrides(nextColumnOrders)
    setStatusOverrides(sourceStatus === status ? statusOverrides : { ...statusOverrides, [taskId]: status })

    try {
      await onTaskMove(taskId, status, destination)
    } catch (error: unknown) {
      setColumnOrderOverrides(previousColumnOrders)
      setStatusOverrides(previousStatusOverrides)
      setMoveError(error instanceof Error ? error.message : `Unable to move “${task.title}”. Please try again.`)
    } finally {
      setPendingTaskId(null)
    }
  }

  const handleDragStart = (event: DragEvent<HTMLElement>, taskId: string) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.dropEffect = 'move'
    event.dataTransfer.setData('text/plain', taskId)
    setDraggedTaskId(taskId)
    setMoveError(null)
  }

  const handleDrop = async (
    event: DragEvent<HTMLElement>,
    status: TaskStatus,
    destinationIndex: number,
    destination: TaskMoveDestination,
  ) => {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/plain') || draggedTaskId
    setDropTarget(null)
    setDraggedTaskId(null)

    if (taskId) {
      await moveTask(taskId, status, destinationIndex, destination)
    }
  }

  return (
    <section aria-label="Kanban task board" className="task-board">
      {moveError ? <InlineError message={moveError} /> : null}
      {boardColumns.map(({ label, status }) => {
        const columnTasks = getColumnTasks(status)
        const isDropTarget = dropTarget?.status === status && draggedTaskId !== null

        return (
          <section
            className={`task-board__column task-board__column--${status}${isDropTarget ? ' task-board__column--drop-target' : ''}`}
            key={status}
            onDragEnter={(event) => {
              event.preventDefault()
              setDropTarget((currentTarget) => currentTarget?.status === status && currentTarget.index === columnTasks.length
                ? currentTarget
                : { index: columnTasks.length, status })
            }}
            onDragLeave={(event) => {
              const nextTarget = event.relatedTarget

              if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
                setDropTarget((currentTarget) => currentTarget?.status === status ? null : currentTarget)
              }
            }}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(event) => void handleDrop(event, status, columnTasks.length, { type: 'end' })}
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
              {columnTasks.length ? columnTasks.map((task, index) => {
                const isDropBefore = dropTarget?.status === status && dropTarget.index === index && draggedTaskId !== task.id
                const isDropAfter = dropTarget?.status === status && dropTarget.index === index + 1 && draggedTaskId !== task.id

                return (
                  <article
                    aria-busy={pendingTaskId === task.id || undefined}
                    className={[
                      'task-board-card',
                      pendingTaskId === task.id ? 'task-board-card--moving' : '',
                      draggedTaskId === task.id ? 'task-board-card--dragging' : '',
                      isDropBefore ? 'task-board-card--drop-before' : '',
                      isDropAfter ? 'task-board-card--drop-after' : '',
                    ].filter(Boolean).join(' ')}
                    draggable={pendingTaskId === null}
                    key={task.id}
                    onDragEnd={() => {
                      setDraggedTaskId(null)
                      setDropTarget(null)
                    }}
                    onDragOver={(event) => {
                      event.preventDefault()
                      event.stopPropagation()

                      if (draggedTaskId === task.id) {
                        return
                      }

                      event.dataTransfer.dropEffect = 'move'
                      const cardBounds = event.currentTarget.getBoundingClientRect()
                      const targetIndex = index + Number(event.clientY > cardBounds.top + cardBounds.height / 2)

                      setDropTarget((currentTarget) => currentTarget?.status === status && currentTarget.index === targetIndex
                        ? currentTarget
                        : { index: targetIndex, status })
                    }}
                    onDrop={(event) => {
                      if (draggedTaskId === task.id) {
                        event.preventDefault()
                        event.stopPropagation()
                        return
                      }

                      event.stopPropagation()
                      const cardBounds = event.currentTarget.getBoundingClientRect()
                      const dropAfterTask = event.clientY > cardBounds.top + cardBounds.height / 2
                      const targetIndex = index + Number(dropAfterTask)
                      void handleDrop(event, status, targetIndex, {
                        taskId: task.id,
                        type: dropAfterTask ? 'after' : 'before',
                      })
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
                        onChange={(event) => void moveTask(
                          task.id,
                          event.target.value as TaskStatus,
                          getColumnTasks(event.target.value as TaskStatus).length,
                          { type: 'end' },
                        )}
                        value={task.status}
                      >
                        {boardColumns.map((column) => <option key={column.status} value={column.status}>{column.label}</option>)}
                      </select>
                    </label>
                  </article>
                )
              }) : <p className="task-board__empty">Drop a task here.</p>}
            </div>
          </section>
        )
      })}
    </section>
  )
}
