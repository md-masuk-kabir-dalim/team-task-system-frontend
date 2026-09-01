import { Filter, Search, X } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { Button } from '../../../components/ui/button.tsx'
import { Select } from '../../../components/ui/select.tsx'
import { Sheet } from '../../../components/ui/sheet.tsx'
import { useTaskUiStore } from '../../../stores/task-ui-store.ts'
import type { DueDateFilter, TaskFilters } from '../types/task-query-types.ts'
import type { TaskPriority, TaskStatus, TeamMember } from '../types/task-types.ts'

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Done', value: 'done' },
] as const

const priorityOptions = [
  { label: 'All priorities', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
] as const

const dueDateOptions = [
  { label: 'Any due date', value: 'all' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Due today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'No due date', value: 'no-date' },
] as const

interface TaskFilterBarProps {
  currentMemberId: string
  filters: TaskFilters
  members: readonly TeamMember[]
  onClear: () => void
  onFiltersChange: (filters: TaskFilters) => void
  onSearchChange: (search: string) => void
  search: string
}

function getFilterCount(filters: TaskFilters) {
  return Number(filters.status !== 'all')
    + Number(filters.priority !== 'all')
    + Number(filters.dueDate !== 'all')
    + Number(filters.assigneeId !== 'all')
}

function TaskFilterFields({ filters, members, onFiltersChange }: Pick<TaskFilterBarProps, 'filters' | 'members' | 'onFiltersChange'>) {
  const updateFilter = <Key extends keyof TaskFilters>(key: Key, value: TaskFilters[Key]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const assigneeOptions = [
    { label: 'Anyone', value: 'all' },
    { label: 'Unassigned', value: 'unassigned' },
    ...members.map((member) => ({ label: member.name, value: member.id })),
  ]

  return (
    <div className="task-filter-fields">
      <Select
        label="Status"
        onChange={(event: ChangeEvent<HTMLSelectElement>) => updateFilter('status', event.target.value as TaskStatus | 'all')}
        options={statusOptions}
        value={filters.status}
      />
      <Select
        label="Priority"
        onChange={(event: ChangeEvent<HTMLSelectElement>) => updateFilter('priority', event.target.value as TaskPriority | 'all')}
        options={priorityOptions}
        value={filters.priority}
      />
      <Select
        label="Assignee"
        onChange={(event: ChangeEvent<HTMLSelectElement>) => updateFilter('assigneeId', event.target.value)}
        options={assigneeOptions}
        value={filters.assigneeId}
      />
      <Select
        label="Due date"
        onChange={(event: ChangeEvent<HTMLSelectElement>) => updateFilter('dueDate', event.target.value as DueDateFilter)}
        options={dueDateOptions}
        value={filters.dueDate}
      />
    </div>
  )
}

export function TaskFilterBar({ currentMemberId, filters, members, onClear, onFiltersChange, onSearchChange, search }: TaskFilterBarProps) {
  const closeFilterSheet = useTaskUiStore((state) => state.closeFilterSheet)
  const isFilterSheetOpen = useTaskUiStore((state) => state.isFilterSheetOpen)
  const openFilterSheet = useTaskUiStore((state) => state.openFilterSheet)
  const filterCount = getFilterCount(filters)

  const setQuickFilter = (nextFilters: TaskFilters) => {
    onFiltersChange(nextFilters)
  }

  return (
    <section aria-label="Task filters" className="task-filter-bar">
      <label className="task-search">
        <span className="sr-only">Search tasks</span>
        <Search aria-hidden="true" size={18} />
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks, descriptions, or people"
          type="search"
          value={search}
        />
      </label>

      <div className="task-filter-bar__quick-filters" aria-label="Quick filters">
        <Button onClick={() => setQuickFilter({ ...filters, assigneeId: currentMemberId })} size="sm" variant="outline">My tasks</Button>
        <Button onClick={() => setQuickFilter({ ...filters, priority: 'urgent' })} size="sm" variant="outline">Urgent</Button>
        <Button onClick={() => setQuickFilter({ ...filters, dueDate: 'overdue' })} size="sm" variant="outline">Overdue</Button>
        <Button onClick={() => setQuickFilter({ ...filters, assigneeId: 'unassigned' })} size="sm" variant="outline">Unassigned</Button>
      </div>

      <div className="task-filter-bar__desktop-controls">
        <TaskFilterFields filters={filters} members={members} onFiltersChange={onFiltersChange} />
        <Button disabled={!filterCount && !search} onClick={onClear} size="sm" variant="ghost">
          <X aria-hidden="true" size={16} />
          Clear
        </Button>
      </div>

      <Button className="task-filter-bar__mobile-trigger" onClick={openFilterSheet} variant="secondary">
        <Filter aria-hidden="true" size={17} />
        Filters{filterCount ? ` (${filterCount})` : ''}
      </Button>

      <Sheet
        description="Refine the tasks in this view."
        onClose={closeFilterSheet}
        open={isFilterSheetOpen}
        title="Filter tasks"
      >
        <TaskFilterFields filters={filters} members={members} onFiltersChange={onFiltersChange} />
        <div className="task-filter-sheet__actions">
          <Button disabled={!filterCount && !search} onClick={onClear} variant="ghost">Clear filters</Button>
          <Button onClick={closeFilterSheet}>Show tasks</Button>
        </div>
      </Sheet>
    </section>
  )
}
