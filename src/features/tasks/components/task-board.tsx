import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, MessageCircle, MoreHorizontal, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { InlineError } from '../../../components/feedback/inline-error.tsx'
import { appRoutes } from '../../../lib/navigation.ts'
import { useUiStore } from '../../../stores/ui-store.ts'
import type { TaskMoveDestination } from '../api/task-service.ts'
import type { Task, TaskStatus, TeamMember } from '../types/task-types.ts'
import { formatTaskDueDate } from '../utils/task-date-utils.ts'
import { TaskAssignee } from './task-assignee.tsx'
import { TaskPriorityBadge } from './task-priority-badge.tsx'
import { TaskStatusBadge } from './task-status-badge.tsx'

const boardColumns: readonly { label: string; status: TaskStatus }[] = [
  { label: 'To do', status: 'todo' },
  { label: 'In progress', status: 'in-progress' },
  { label: 'In review', status: 'review' },
  { label: 'Completed', status: 'done' },
]

type BoardOrder = Record<TaskStatus, string[]>
type ColumnOrderOverrides = Partial<Record<TaskStatus, readonly string[]>>

interface TaskBoardProps {
  members: readonly TeamMember[]
  onTaskMove: (taskId: string, status: TaskStatus, destination: TaskMoveDestination) => Promise<void>
  tasks: readonly Task[]
}

interface TaskBoardColumnProps {
  disabled: boolean
  label: string
  membersById: ReadonlyMap<string, TeamMember>
  onCreateTask: () => void
  onMoveToStatus: (taskId: string, status: TaskStatus) => void
  status: TaskStatus
  tasks: readonly Task[]
}

interface SortableTaskCardProps {
  disabled: boolean
  membersById: ReadonlyMap<string, TeamMember>
  onMoveToStatus: (taskId: string, status: TaskStatus) => void
  status: TaskStatus
  task: Task
}

interface TaskCardContentProps {
  disabled?: boolean
  isOverlay?: boolean
  membersById: ReadonlyMap<string, TeamMember>
  onMoveToStatus?: (status: TaskStatus) => void
  status: TaskStatus
  task: Task
}

interface TaskLocation {
  index: number
  status: TaskStatus
}

function createEmptyBoardOrder(): BoardOrder {
  return {
    review: [],
    done: [],
    'in-progress': [],
    todo: [],
  }
}

function cloneBoardOrder(order: BoardOrder): BoardOrder {
  return {
    review: [...order.review],
    done: [...order.done],
    'in-progress': [...order['in-progress']],
    todo: [...order.todo],
  }
}

function getColumnDropId(status: TaskStatus) {
  return `task-board-column-${status}`
}

function getColumnStatus(dropId: string): TaskStatus | null {
  const status = dropId.replace('task-board-column-', '')

  return boardColumns.some((column) => column.status === status) ? status as TaskStatus : null
}

function findTaskLocation(order: BoardOrder, taskId: string): TaskLocation | null {
  for (const { status } of boardColumns) {
    const index = order[status].indexOf(taskId)

    if (index !== -1) {
      return { index, status }
    }
  }

  return null
}

function getBoardOrder(tasks: readonly Task[], overrides: ColumnOrderOverrides): BoardOrder {
  const order = createEmptyBoardOrder()

  for (const { status } of boardColumns) {
    const explicitOrder = new Map(overrides[status]?.map((taskId, index) => [taskId, index]))

    order[status] = tasks
      .filter((task) => task.status === status)
      .toSorted((left, right) => {
        const leftIndex = explicitOrder.get(left.id)
        const rightIndex = explicitOrder.get(right.id)

        if (leftIndex !== undefined && rightIndex !== undefined) {
          return leftIndex - rightIndex
        }

        if (leftIndex !== undefined) {
          return -1
        }

        if (rightIndex !== undefined) {
          return 1
        }

        return left.position - right.position || left.id.localeCompare(right.id)
      })
      .map((task) => task.id)
  }

  return order
}

function getTasksForColumn(
  order: BoardOrder,
  status: TaskStatus,
  taskById: ReadonlyMap<string, Task>,
) {
  return order[status].flatMap((taskId) => {
    const task = taskById.get(taskId)
    return task ? [task] : []
  })
}

function moveTaskInOrder(
  order: BoardOrder,
  taskId: string,
  destinationStatus: TaskStatus,
  destinationIndex: number,
) {
  const source = findTaskLocation(order, taskId)

  if (!source) {
    return order
  }

  const nextOrder = cloneBoardOrder(order)
  nextOrder[source.status].splice(source.index, 1)
  const adjustedIndex = source.status === destinationStatus && source.index < destinationIndex
    ? destinationIndex - 1
    : destinationIndex
  const targetItems = nextOrder[destinationStatus]
  const targetIndex = Math.max(0, Math.min(adjustedIndex, targetItems.length))
  targetItems.splice(targetIndex, 0, taskId)

  return nextOrder
}

function areOrdersEqual(left: BoardOrder, right: BoardOrder) {
  return boardColumns.every(({ status }) => left[status].join(',') === right[status].join(','))
}

function getDestination(order: BoardOrder, taskId: string): { status: TaskStatus; target: TaskMoveDestination } | null {
  const location = findTaskLocation(order, taskId)

  if (!location) {
    return null
  }

  const taskAfterMovedTask = order[location.status][location.index + 1]

  return {
    status: location.status,
    target: taskAfterMovedTask ? { taskId: taskAfterMovedTask, type: 'before' } : { type: 'end' },
  }
}

function getDropLocation(order: BoardOrder, event: DragOverEvent | DragEndEvent): TaskLocation | null {
  if (!event.over) {
    return null
  }

  const overId = String(event.over.id)
  const columnStatus = getColumnStatus(overId)

  if (columnStatus) {
    return { index: order[columnStatus].length, status: columnStatus }
  }

  const overTaskLocation = findTaskLocation(order, overId)

  if (!overTaskLocation) {
    return null
  }

  const activeTop = event.active.rect.current.translated?.top
  const overMiddle = event.over.rect.top + event.over.rect.height / 2
  const shouldInsertAfter = activeTop !== null && activeTop !== undefined && activeTop > overMiddle

  return {
    index: overTaskLocation.index + Number(shouldInsertAfter),
    status: overTaskLocation.status,
  }
}

function TaskCardContent({ disabled = false, isOverlay = false, membersById, onMoveToStatus, status, task }: TaskCardContentProps) {
  const progress = Math.min(10, 1 + ((task.position * 3) % 10))
  const commentCount = task.position % 3 === 0 ? 1 + (task.position % 6) : 0

  const content = (
    <>
      <div className="task-board-card__meta">
        {status === 'done' ? <TaskStatusBadge status="done" /> : <TaskPriorityBadge priority={task.priority} />}
        <MoreHorizontal aria-hidden="true" size={18} />
      </div>
      <h3>{task.title}</h3>
      <p>{task.description ?? 'No additional description was added.'}</p>
      <div aria-label={`Progress: ${progress} of 10`} className="task-board-card__progress">
        <span><span>Progress</span><strong>{progress}/10</strong></span>
        <i aria-hidden="true" style={{ width: `${progress * 10}%` }} />
      </div>
      <footer>
        <span><CalendarDays aria-hidden="true" size={15} />{formatTaskDueDate(task.dueDate)}</span>
        <span className="task-board-card__footer-actions">
          <TaskAssignee assignee={task.assigneeId ? membersById.get(task.assigneeId) : undefined} />
          {commentCount ? <span className="task-board-card__comments"><MessageCircle aria-hidden="true" size={15} />{commentCount}</span> : null}
        </span>
      </footer>
    </>
  )

  return (
    <>
      {isOverlay ? <div className="task-board-card__content">{content}</div> : <Link to={appRoutes.taskDetails(task.id)}>{content}</Link>}
      <label className="task-board-card__move">
        <span>Move to</span>
        <select
          aria-label={`Move ${task.title} to a new status`}
          disabled={disabled || !onMoveToStatus}
          onChange={(event) => onMoveToStatus?.(event.target.value as TaskStatus)}
          tabIndex={isOverlay ? -1 : undefined}
          value={status}
        >
          {boardColumns.map((column) => <option key={column.status} value={column.status}>{column.label}</option>)}
        </select>
      </label>
    </>
  )
}

function SortableTaskCard({ disabled, membersById, onMoveToStatus, status, task }: SortableTaskCardProps) {
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    disabled,
    id: task.id,
  })
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      aria-busy={disabled || undefined}
      className={`task-board-card${isDragging ? ' task-board-card--drag-source' : ''}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCardContent
        disabled={disabled}
        membersById={membersById}
        onMoveToStatus={(nextStatus) => onMoveToStatus(task.id, nextStatus)}
        status={status}
        task={task}
      />
    </article>
  )
}

function TaskBoardColumn({ disabled, label, membersById, onCreateTask, onMoveToStatus, status, tasks }: TaskBoardColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: getColumnDropId(status) })

  return (
    <section
      className={`task-board__column task-board__column--${status}${isOver ? ' task-board__column--drop-target' : ''}`}
      ref={setNodeRef}
    >
      <header className="task-board__column-header">
        <div>
          <span aria-hidden="true" className="task-board__status-dot" />
          <h2>{label}</h2>
          <span className="task-board__count">{String(tasks.length).padStart(2, '0')}</span>
        </div>
        <button aria-label={`Add a ${label.toLocaleLowerCase()} task`} className="task-board__add" onClick={onCreateTask} type="button">
          <Plus aria-hidden="true" size={19} />
        </button>
      </header>
      <SortableContext id={`task-board-sortable-${status}`} items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="task-board__cards">
          {tasks.length ? tasks.map((task) => (
            <SortableTaskCard
              disabled={disabled}
              key={task.id}
              membersById={membersById}
              onMoveToStatus={onMoveToStatus}
              status={status}
              task={task}
            />
          )) : <p className="task-board__empty">Drop a task here.</p>}
        </div>
      </SortableContext>
      <button className="task-board__footer-action" onClick={onCreateTask} type="button">
        <Plus aria-hidden="true" size={16} />
        Add Task
      </button>
    </section>
  )
}

export function TaskBoard({ members, onTaskMove, tasks }: TaskBoardProps) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [columnOrderOverrides, setColumnOrderOverrides] = useState<ColumnOrderOverrides>({})
  const [dragOverlayWidth, setDragOverlayWidth] = useState<number | null>(null)
  const [dragPreview, setDragPreview] = useState<BoardOrder | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, TaskStatus>>({})
  const dragPreviewRef = useRef<BoardOrder | null>(null)
  const dragStartOrderRef = useRef<BoardOrder | null>(null)
  const membersById = new Map(members.map((member) => [member.id, member]))
  const openCreateTask = useUiStore((state) => state.openCreateTask)
  const boardTasks = tasks.map((task) => {
    const optimisticStatus = statusOverrides[task.id]
    return optimisticStatus ? { ...task, status: optimisticStatus } : task
  })
  const taskById = new Map(boardTasks.map((task) => [task.id, task]))
  const baseOrder = getBoardOrder(boardTasks, columnOrderOverrides)
  const renderedOrder = dragPreview ?? baseOrder
  const activeTask = activeTaskId ? taskById.get(activeTaskId) : undefined
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const resetDragState = () => {
    dragPreviewRef.current = null
    dragStartOrderRef.current = null
    setActiveTaskId(null)
    setDragOverlayWidth(null)
    setDragPreview(null)
  }

  const persistMove = async (taskId: string, startOrder: BoardOrder, finalOrder: BoardOrder) => {
    const source = findTaskLocation(startOrder, taskId)
    const destination = getDestination(finalOrder, taskId)
    const task = taskById.get(taskId)

    if (!source || !destination || !task || areOrdersEqual(startOrder, finalOrder)) {
      return
    }

    const previousStatusOverrides = statusOverrides
    const previousColumnOrders = columnOrderOverrides

    setMoveError(null)
    setPendingTaskId(taskId)
    setColumnOrderOverrides(finalOrder)
    setStatusOverrides(source.status === destination.status
      ? statusOverrides
      : { ...statusOverrides, [taskId]: destination.status })

    try {
      await onTaskMove(taskId, destination.status, destination.target)
    } catch (error: unknown) {
      setColumnOrderOverrides(previousColumnOrders)
      setStatusOverrides(previousStatusOverrides)
      setMoveError(error instanceof Error ? error.message : `Unable to move “${task.title}”. Please try again.`)
    } finally {
      setPendingTaskId(null)
    }
  }

  const moveTaskToStatus = (taskId: string, status: TaskStatus) => {
    const startOrder = baseOrder
    const source = findTaskLocation(startOrder, taskId)

    if (!source || pendingTaskId) {
      return
    }

    const finalOrder = moveTaskInOrder(startOrder, taskId, status, startOrder[status].length)
    void persistMove(taskId, startOrder, finalOrder)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const startOrder = cloneBoardOrder(baseOrder)

    dragPreviewRef.current = startOrder
    dragStartOrderRef.current = startOrder
    setActiveTaskId(String(event.active.id))
    setDragOverlayWidth(event.active.rect.current.initial?.width ?? null)
    setDragPreview(startOrder)
    setMoveError(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const taskId = String(event.active.id)
    const currentOrder = dragPreviewRef.current ?? baseOrder
    const currentLocation = findTaskLocation(currentOrder, taskId)
    const dropLocation = getDropLocation(currentOrder, event)

    if (!currentLocation || !dropLocation || currentLocation.status === dropLocation.status) {
      return
    }

    const nextOrder = moveTaskInOrder(currentOrder, taskId, dropLocation.status, dropLocation.index)
    dragPreviewRef.current = nextOrder
    setDragPreview(nextOrder)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const taskId = String(event.active.id)
    const startOrder = dragStartOrderRef.current ?? baseOrder
    const currentOrder = dragPreviewRef.current ?? startOrder
    const dropLocation = getDropLocation(currentOrder, event)

    if (!dropLocation) {
      resetDragState()
      return
    }

    const finalOrder = moveTaskInOrder(currentOrder, taskId, dropLocation.status, dropLocation.index)
    resetDragState()
    void persistMove(taskId, startOrder, finalOrder)
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragCancel={resetDragState}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <section aria-label="Kanban task board" className="task-board">
        {moveError ? <InlineError message={moveError} /> : null}
        {boardColumns.map(({ label, status }) => (
          <TaskBoardColumn
            disabled={pendingTaskId !== null}
            key={status}
            label={label}
            membersById={membersById}
            onCreateTask={openCreateTask}
            onMoveToStatus={moveTaskToStatus}
            status={status}
            tasks={getTasksForColumn(renderedOrder, status, taskById)}
          />
        ))}
      </section>
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        {activeTask ? (
          <article aria-hidden="true" className="task-board-card task-board-card--overlay" style={{ width: dragOverlayWidth ?? undefined }}>
            <TaskCardContent isOverlay membersById={membersById} status={activeTask.status} task={activeTask} />
          </article>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
