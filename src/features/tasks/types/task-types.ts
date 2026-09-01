export const taskStatuses = ['todo', 'in-progress', 'blocked', 'done'] as const

export type TaskStatus = (typeof taskStatuses)[number]

export const taskPriorities = ['low', 'medium', 'high', 'urgent'] as const

export type TaskPriority = (typeof taskPriorities)[number]

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
