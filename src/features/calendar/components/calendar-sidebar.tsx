import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button.tsx'
import { CalendarMiniMonth } from './calendar-mini-month.tsx'
import { getCalendarCategory, type CalendarCategoryDefinition, type CalendarCategoryVisibility } from '../types/calendar-types.ts'
import type { Task } from '../../tasks/types/task-types.ts'
import { getCalendarEvent } from '../utils/calendar-utils.ts'

const categories: readonly CalendarCategoryDefinition[] = [
  { color: '#319cff', label: 'Team events', value: 'team' },
  { color: '#29ca82', label: 'Work', value: 'work' },
  { color: '#8b68ff', label: 'Projects', value: 'projects' },
  { color: '#ffa81c', label: 'Design', value: 'design' },
]

interface CalendarSidebarProps {
  activeCategories: CalendarCategoryVisibility
  onAddTask: () => void
  onSelectDate: (date: string) => void
  onToggleCategory: (category: CalendarCategoryDefinition['value']) => void
  selectedDate: Date
  tasks: readonly Task[]
}

function getUpcomingTasks(tasks: readonly Task[]) {
  return tasks
    .flatMap((task) => {
      if (!task.dueDate) {
        return []
      }

      const event = getCalendarEvent(task)
      return event ? [event] : []
    })
    .toSorted((left, right) => (left.task.dueDate ?? '').localeCompare(right.task.dueDate ?? ''))
    .slice(0, 3)
}

export function CalendarSidebar({ activeCategories, onAddTask, onSelectDate, onToggleCategory, selectedDate, tasks }: CalendarSidebarProps) {
  const upcomingTasks = getUpcomingTasks(tasks)

  return (
    <aside className="calendar-sidebar">
      <CalendarMiniMonth onSelectDate={onSelectDate} selectedDate={selectedDate} />
      <section className="calendar-sidebar__section" aria-label="Event filters">
        <header><h2>Event</h2><Button aria-label="Add a task" onClick={onAddTask} size="icon" variant="ghost"><Plus aria-hidden="true" size={16} /></Button></header>
        <div className="calendar-sidebar__categories">
          {categories.map((category) => (
            <label key={category.value}>
              <span style={{ background: category.color }} />
              <span>{category.label}</span>
              <input checked={activeCategories[category.value]} onChange={() => onToggleCategory(category.value)} type="checkbox" />
            </label>
          ))}
        </div>
      </section>
      <section className="calendar-sidebar__section calendar-sidebar__upcoming" aria-labelledby="upcoming-events">
        <h2 id="upcoming-events">Upcoming tasks</h2>
        <ul>
          {upcomingTasks.map((event) => (
            <li key={event.task.id}>
              <span className={`calendar-sidebar__upcoming-dot calendar-sidebar__upcoming-dot--${getCalendarCategory(event.task.status)}`} />
              <div><strong>{event.task.title}</strong><span>{event.task.dueDate}</span></div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
