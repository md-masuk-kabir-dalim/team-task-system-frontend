import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/button.tsx'
import type { CalendarView } from '../types/calendar-types.ts'

interface CalendarToolbarProps {
  compact?: boolean
  onMoveDate: (direction: -1 | 1) => void
  onToday: () => void
  onViewChange: (view: CalendarView) => void
  rangeLabel: string
  view: CalendarView
}

const viewOptions: readonly { label: string; value: CalendarView }[] = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
]

export function CalendarToolbar({ compact = false, onMoveDate, onToday, onViewChange, rangeLabel, view }: CalendarToolbarProps) {
  const visibleViewOptions = compact ? viewOptions.filter((option) => option.value === 'day') : viewOptions

  return (
    <header className="calendar-toolbar">
      <div aria-label="Calendar view" className="calendar-toolbar__views" role="tablist">
        {visibleViewOptions.map((option) => (
          <button aria-selected={view === option.value} key={option.value} onClick={() => onViewChange(option.value)} role="tab" type="button">{option.label}</button>
        ))}
      </div>
      <div className="calendar-toolbar__range">
        <Button onClick={onToday} size="sm" variant="secondary"><CalendarDays aria-hidden="true" size={14} />Today</Button>
        <Button aria-label="Previous period" onClick={() => onMoveDate(-1)} size="icon" variant="ghost"><ChevronLeft aria-hidden="true" size={16} /></Button>
        <strong>{rangeLabel}</strong>
        <Button aria-label="Next period" onClick={() => onMoveDate(1)} size="icon" variant="ghost"><ChevronRight aria-hidden="true" size={16} /></Button>
      </div>
    </header>
  )
}
