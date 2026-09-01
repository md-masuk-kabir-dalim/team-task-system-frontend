import type { Task } from '../types/task-types.ts'

function createDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

export function getTodayDateKey() {
  return createDateKey(new Date())
}

export function isTaskOverdue(task: Pick<Task, 'dueDate' | 'status'>, today = getTodayDateKey()) {
  return task.status !== 'done' && task.dueDate !== null && task.dueDate < today
}

export function formatTaskDueDate(dueDate: string | null) {
  if (dueDate === null) {
    return 'No due date'
  }

  if (dueDate === getTodayDateKey()) {
    return 'Today'
  }

  return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
    .format(new Date(`${dueDate}T12:00:00`))
}
