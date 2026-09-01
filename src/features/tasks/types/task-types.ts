export const taskStatuses = ['todo', 'in-progress', 'blocked', 'done'] as const

export type TaskStatus = (typeof taskStatuses)[number]

export function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.includes(value as TaskStatus)
}

export const taskPriorities = ['low', 'medium', 'high', 'urgent'] as const

export type TaskPriority = (typeof taskPriorities)[number]

export function isTaskPriority(value: string): value is TaskPriority {
  return taskPriorities.includes(value as TaskPriority)
}

export interface TeamMember {
  email: string
  id: string
  name: string
}

export interface Task {
  assigneeId: string | null
  createdAt: string
  description: string | null
  dueDate: string | null
  id: string
  priority: TaskPriority
  status: TaskStatus
  title: string
  updatedAt: string
}
