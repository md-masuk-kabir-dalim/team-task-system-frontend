import type { TaskPriority, TaskStatus } from './task-types.ts'

export type DueDateFilter = 'all' | 'no-date' | 'overdue' | 'today' | 'upcoming'

export type AssigneeFilter = 'all' | 'unassigned' | string

export interface TaskFilters {
  assigneeId: AssigneeFilter
  dueDate: DueDateFilter
  priority: TaskPriority | 'all'
  status: TaskStatus | 'all'
}

export const taskSortFields = ['dueDate', 'priority', 'createdAt', 'updatedAt', 'title'] as const

export type TaskSortField = (typeof taskSortFields)[number]

export type SortDirection = 'asc' | 'desc'

export interface TaskSort {
  direction: SortDirection
  field: TaskSortField
}

export interface TaskListQuery {
  filters: TaskFilters
  page: number
  pageSize: number
  search: string
  sort: TaskSort
}

export interface PaginationMetadata {
  page: number
  pageCount: number
  pageSize: number
  totalItems: number
}

export interface TaskSummary {
  overdue: number
  total: number
  unassigned: number
  urgent: number
}
