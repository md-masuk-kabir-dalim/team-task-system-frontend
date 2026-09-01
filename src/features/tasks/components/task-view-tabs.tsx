import { CalendarDays, Columns3, List } from 'lucide-react'
import type { TaskView } from '../types/task-query-types.ts'

const viewOptions = [
  { icon: Columns3, label: 'Kanban', value: 'board' },
  { icon: List, label: 'List', value: 'list' },
  { icon: CalendarDays, label: 'Timeline', value: 'timeline' },
] as const

interface TaskViewTabsProps {
  onViewChange: (view: TaskView) => void
  view: TaskView
}

export function TaskViewTabs({ onViewChange, view }: TaskViewTabsProps) {
  return (
    <div aria-label="Task view" className="task-view-tabs" role="tablist">
      {viewOptions.map(({ icon: Icon, label, value }) => (
        <button
          aria-selected={view === value}
          className={view === value ? 'task-view-tabs__tab task-view-tabs__tab--active' : 'task-view-tabs__tab'}
          key={value}
          onClick={() => onViewChange(value)}
          role="tab"
          type="button"
        >
          <Icon aria-hidden="true" size={16} strokeWidth={1.9} />
          {label}
        </button>
      ))}
    </div>
  )
}
