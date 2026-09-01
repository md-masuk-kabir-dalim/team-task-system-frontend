import type { CSSProperties } from 'react'
import type { Task, TeamMember } from '../types/task-types.ts'
import { formatTaskDueDate } from '../utils/task-date-utils.ts'

interface TaskTimelineProps {
  members: readonly TeamMember[]
  tasks: readonly Task[]
}

function getWeekStart() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7))
  return date
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function getOffset(date: Date, weekStart: Date) {
  return Math.round((date.getTime() - weekStart.getTime()) / 86_400_000)
}

function getTimelinePosition(task: Task, index: number, weekStart: Date) {
  const anchor = task.dueDate ? new Date(`${task.dueDate}T12:00:00`) : new Date(task.createdAt)
  const dueOffset = getOffset(anchor, weekStart)
  const duration = 1 + (index % 3)
  const start = Math.max(0, Math.min(6, dueOffset - duration + 1))

  return { span: Math.min(duration, 7 - start), start }
}

function getTaskOwner(task: Task, members: readonly TeamMember[]) {
  return task.assigneeId ? members.find((member) => member.id === task.assigneeId)?.name ?? 'Unassigned' : 'Unassigned'
}

export function TaskTimeline({ members, tasks }: TaskTimelineProps) {
  const weekStart = getWeekStart()
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const timelineTasks = tasks.slice(0, 6)
  const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short' })

  return (
    <section aria-label="Task timeline" className="task-timeline">
      <header className="task-timeline__header">
        <span>Task</span>
        {weekDays.map((day) => (
          <span key={day.toISOString()}><strong>{day.getDate()}</strong> {weekdayFormat.format(day)}</span>
        ))}
      </header>
      <div className="task-timeline__rows">
        {timelineTasks.map((task, index) => {
          const position = getTimelinePosition(task, index, weekStart)
          const barStyle = {
            gridColumn: `${position.start + 2} / span ${position.span}`,
          } satisfies CSSProperties

          return (
            <article className="task-timeline__row" key={task.id}>
              <div className="task-timeline__label">
                <span aria-hidden="true" className={`task-timeline__dot task-timeline__dot--${task.status}`} />
                <div>
                  <h2>{task.title}</h2>
                  <p>{getTaskOwner(task, members)}</p>
                </div>
              </div>
              <span className={`task-timeline__bar task-timeline__bar--${task.status}`} style={barStyle}>
                {formatTaskDueDate(task.dueDate)}
              </span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
