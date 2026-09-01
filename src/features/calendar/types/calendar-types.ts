import type { Task, TaskStatus } from '../../tasks/types/task-types.ts'

export const calendarViews = ['day', 'week', 'month'] as const
export type CalendarView = (typeof calendarViews)[number]

export const calendarCategories = ['team', 'work', 'projects', 'design'] as const
export type CalendarCategory = (typeof calendarCategories)[number]

export interface CalendarTaskEvent {
  category: CalendarCategory
  durationMinutes: number
  endMinutes: number
  startMinutes: number
  task: Task
}

export interface CalendarCategoryDefinition {
  color: string
  label: string
  value: CalendarCategory
}

export type CalendarCategoryVisibility = Record<CalendarCategory, boolean>

export function isCalendarView(value: string): value is CalendarView {
  return calendarViews.includes(value as CalendarView)
}

export function getCalendarCategory(status: TaskStatus): CalendarCategory {
  switch (status) {
    case 'in-progress':
      return 'work'
    case 'blocked':
      return 'projects'
    case 'done':
      return 'design'
    default:
      return 'team'
  }
}
