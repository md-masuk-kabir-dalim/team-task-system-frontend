import type { TaskPriority, TaskStatus } from './task-types.ts'

export type DueDateFilter = 'all' | 'no-date' | 'overdue' | 'today' | 'upcoming'

export function isDueDateFilter(value: string): value is DueDateFilter {
  return ['all', 'no-date', 'overdue', 'today', 'upcoming'].includes(value)
}

export type AssigneeFilter = 'all' | 'unassigned' | string

export interface TaskFilters {
  assigneeId: AssigneeFilter
  dueDate: DueDateFilter
  priority: TaskPriority | 'all'
  status: TaskStatus | 'all'
}

export const taskSortFields = ['dueDate', 'priority', 'createdAt', 'updatedAt', 'title'] as const

export type TaskSortField = (typeof taskSortFields)[number]

export function isTaskSortField(value: string): value is TaskSortField {
  return taskSortFields.includes(value as TaskSortField)
}

export type SortDirection = 'asc' | 'desc'

export function isSortDirection(value: string): value is SortDirection {
  return value === 'asc' || value === 'desc'
}

export interface TaskSort {
  direction: SortDirection
  field: TaskSortField
}

export const taskViews = ['board', 'list', 'timeline'] as const

export type TaskView = (typeof taskViews)[number]

export function isTaskView(value: string): value is TaskView {
  return taskViews.includes(value as TaskView)
}

export interface TaskListQuery {
  filters: TaskFilters
  page: number
  pageSize: number
  search: string
  sort: TaskSort
  view: TaskView
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
