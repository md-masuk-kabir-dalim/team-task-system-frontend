import type { CSSProperties } from 'react'
import { CalendarEventCard } from './calendar-event-card.tsx'
import { calendarHourEnd, calendarHourHeight, calendarHourStart, getEventsForDate, getMonthDayEvents, getMonthGridDays, getTimeLabel, isSameCalendarDay, toDateKey } from '../utils/calendar-utils.ts'
import type { CalendarCategoryVisibility, CalendarView } from '../types/calendar-types.ts'
import type { Task, TeamMember } from '../../tasks/types/task-types.ts'

interface TaskCalendarGridProps {
  activeCategories: CalendarCategoryVisibility
  days: readonly Date[]
  selectedDate: Date
  tasks: readonly Task[]
  view: CalendarView
  members: readonly TeamMember[]
}

function filterEvents(tasks: readonly Task[], date: Date, activeCategories: CalendarCategoryVisibility) {
  return getEventsForDate(tasks, date).filter((event) => activeCategories[event.category])
}

function CalendarTimeGrid({ activeCategories, days, members, selectedDate, tasks }: Omit<TaskCalendarGridProps, 'view'>) {
  const membersById = new Map(members.map((member) => [member.id, member]))
  const hours = Array.from({ length: calendarHourEnd - calendarHourStart + 1 }, (_, index) => calendarHourStart + index)

  return (
    <div className="task-calendar-grid task-calendar-grid--time">
      <div className="task-calendar-grid__times">
        {hours.map((hour) => <span key={hour}>{getTimeLabel(hour * 60)}</span>)}
      </div>
      <div className="task-calendar-grid__days" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
        {days.map((day) => {
          const events = filterEvents(tasks, day, activeCategories)
          const isToday = isSameCalendarDay(day, new Date())
          const isSelected = isSameCalendarDay(day, selectedDate)

          return (
            <section className={`task-calendar-grid__day${isToday ? ' task-calendar-grid__day--today' : ''}${isSelected ? ' task-calendar-grid__day--selected' : ''}`} key={toDateKey(day)}>
              <header><strong>{new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(day)}</strong><span>{day.getDate()}</span></header>
              <div className="task-calendar-grid__hours" style={{ height: `${(calendarHourEnd - calendarHourStart) * calendarHourHeight}rem` }}>
                {hours.slice(0, -1).map((hour) => <span className="task-calendar-grid__hour-line" key={hour} />)}
                {events.map((event) => {
                  const style = {
                    height: `${Math.max(2.75, (event.durationMinutes / 60) * calendarHourHeight)}rem`,
                    top: `${((event.startMinutes - calendarHourStart * 60) / 60) * calendarHourHeight}rem`,
                  } satisfies CSSProperties

                  return <CalendarEventCard event={event} key={event.task.id} membersById={membersById} style={style} />
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function CalendarMonthGrid({ activeCategories, members, selectedDate, tasks }: Omit<TaskCalendarGridProps, 'days' | 'view'>) {
  const membersById = new Map(members.map((member) => [member.id, member]))
  const monthDays = getMonthGridDays(selectedDate)
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="task-calendar-grid task-calendar-grid--month">
      <div className="task-calendar-grid__month-weekdays">{weekdayLabels.map((label) => <span key={label}>{label}</span>)}</div>
      <div className="task-calendar-grid__month-days">
        {monthDays.map((day) => {
          const events = filterEvents(tasks, day, activeCategories)
          const inCurrentMonth = day.getMonth() === selectedDate.getMonth()

          return (
            <section className={`task-calendar-grid__month-day${inCurrentMonth ? '' : ' task-calendar-grid__month-day--outside'}`} key={toDateKey(day)}>
              <span>{day.getDate()}</span>
              <div>{getMonthDayEvents(events.map((event) => event.task), day).map((event) => <CalendarEventCard compact event={event} key={event.task.id} membersById={membersById} />)}</div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export function TaskCalendarGrid({ activeCategories, days, members, selectedDate, tasks, view }: TaskCalendarGridProps) {
  return view === 'month'
    ? <CalendarMonthGrid activeCategories={activeCategories} members={members} selectedDate={selectedDate} tasks={tasks} />
    : <CalendarTimeGrid activeCategories={activeCategories} days={days} members={members} selectedDate={selectedDate} tasks={tasks} />
}
