import type { Task } from '../../tasks/types/task-types.ts'
import { getCalendarCategory, type CalendarTaskEvent, type CalendarView } from '../types/calendar-types.ts'

export const calendarHourStart = 8
export const calendarHourEnd = 18
export const calendarHourHeight = 4.625

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function parseDateKey(value: string) {
  return new Date(`${value}T12:00:00`)
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

export function addMonths(date: Date, months: number) {
  const nextDate = new Date(date)
  const originalDay = nextDate.getDate()
  nextDate.setDate(1)
  nextDate.setMonth(nextDate.getMonth() + months)
  const lastDayOfNextMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()
  nextDate.setDate(Math.min(originalDay, lastDayOfNextMonth))
  return nextDate
}

export function getWeekStart(date: Date) {
  const weekStart = new Date(date)
  weekStart.setHours(12, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  return weekStart
}

export function getWeekDays(date: Date) {
  const weekStart = getWeekStart(date)
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

export function getVisibleDays(view: CalendarView, selectedDate: Date) {
  if (view === 'day') {
    return [selectedDate]
  }

  return getWeekDays(selectedDate)
}

export function getMonthGridDays(date: Date) {
  const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 12)
  const gridStart = getWeekStart(firstOfMonth)
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

export function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(date)
}

export function formatWeekRange(date: Date) {
  const [start, , , , , , end] = getWeekDays(date)

  if (!start || !end) {
    return ''
  }

  const formatter = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' })
  return `${formatter.format(start)} – ${formatter.format(end)}`
}

export function formatDayHeading(date: Date) {
  return new Intl.DateTimeFormat(undefined, { day: 'numeric', weekday: 'long' }).format(date)
}

export function isSameCalendarDay(left: Date, right: Date) {
  return toDateKey(left) === toDateKey(right)
}

export function getCalendarEvent(task: Task): CalendarTaskEvent | null {
  if (!task.dueDate) {
    return null
  }

  const durationMinutes = 50 + (task.position % 3) * 10
  const startMinutes = 8 * 60 + ((task.position * 43) % (8 * 60))
  const maxStart = calendarHourEnd * 60 - durationMinutes
  const normalizedStart = Math.min(startMinutes, maxStart)

  return {
    category: getCalendarCategory(task.status),
    durationMinutes,
    endMinutes: normalizedStart + durationMinutes,
    startMinutes: normalizedStart,
    task,
  }
}

export function getEventsForDate(tasks: readonly Task[], date: Date) {
  const dateKey = toDateKey(date)

  return tasks
    .flatMap((task) => task.dueDate === dateKey ? [getCalendarEvent(task)] : [])
    .filter((event): event is CalendarTaskEvent => event !== null)
    .toSorted((left, right) => left.startMinutes - right.startMinutes || left.task.position - right.task.position)
}

export function getTimeLabel(minutes: number) {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`
}

export function getMonthDayEvents(tasks: readonly Task[], date: Date) {
  return getEventsForDate(tasks, date).slice(0, 3)
}
