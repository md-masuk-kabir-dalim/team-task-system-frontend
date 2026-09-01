import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '../../../components/ui/icon-button.tsx'
import { addMonths, formatMonthTitle, getMonthGridDays, isSameCalendarDay, toDateKey } from '../utils/calendar-utils.ts'

interface CalendarMiniMonthProps {
  onSelectDate: (date: string) => void
  selectedDate: Date
}

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarMiniMonth({ onSelectDate, selectedDate }: CalendarMiniMonthProps) {
  const monthDays = getMonthGridDays(selectedDate)
  const today = new Date()

  const changeMonth = (direction: -1 | 1) => {
    const nextDate = addMonths(selectedDate, direction)
    onSelectDate(toDateKey(nextDate))
  }

  return (
    <section aria-label="Mini month calendar" className="calendar-mini-month">
      <header>
        <h2>{formatMonthTitle(selectedDate)}</h2>
        <span>
          <IconButton label="Previous month" onClick={() => changeMonth(-1)} variant="ghost"><ChevronLeft aria-hidden="true" size={15} /></IconButton>
          <IconButton label="Next month" onClick={() => changeMonth(1)} variant="ghost"><ChevronRight aria-hidden="true" size={15} /></IconButton>
        </span>
      </header>
      <div aria-hidden="true" className="calendar-mini-month__weekdays">
        {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
      </div>
      <div className="calendar-mini-month__days">
        {monthDays.map((day) => {
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
          const isSelected = isSameCalendarDay(day, selectedDate)
          const isToday = isSameCalendarDay(day, today)

          return (
            <button
              aria-label={`Select ${day.toLocaleDateString()}`}
              aria-pressed={isSelected}
              className={`${!isCurrentMonth ? 'calendar-mini-month__day--outside ' : ''}${isSelected ? 'calendar-mini-month__day--selected ' : ''}${isToday ? 'calendar-mini-month__day--today' : ''}`}
              key={toDateKey(day)}
              onClick={() => onSelectDate(toDateKey(day))}
              type="button"
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </section>
  )
}
