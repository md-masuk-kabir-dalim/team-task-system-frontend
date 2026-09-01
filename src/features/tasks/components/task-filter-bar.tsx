import { ArrowDownUp, Filter, Search } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { Button } from '../../../components/ui/button.tsx'
import { Select } from '../../../components/ui/select.tsx'
import { Sheet } from '../../../components/ui/sheet.tsx'
import { useUiStore } from '../../../stores/ui-store.ts'
import type { DueDateFilter, TaskFilters, TaskSort } from '../types/task-query-types.ts'
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

const sortOptions = [
  { label: 'Due date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Created date', value: 'createdAt' },
  { label: 'Updated date', value: 'updatedAt' },
  { label: 'Title', value: 'title' },
] as const

const sortDirectionOptions = [
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
] as const

interface TaskFilterBarProps {
  filters: TaskFilters
  members: readonly TeamMember[]
  onClear: () => void
  onFiltersChange: (filters: TaskFilters) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: TaskSort) => void
  search: string
  sort: TaskSort
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

export function TaskFilterBar({ filters, members, onClear, onFiltersChange, onSearchChange, onSortChange, search, sort }: TaskFilterBarProps) {
  const closeFilterSheet = useUiStore((state) => state.closeFilterSheet)
  const closeSortSheet = useUiStore((state) => state.closeSortSheet)
  const isFilterSheetOpen = useUiStore((state) => state.isFilterSheetOpen)
  const isSortSheetOpen = useUiStore((state) => state.isSortSheetOpen)
  const openFilterSheet = useUiStore((state) => state.openFilterSheet)
  const openSortSheet = useUiStore((state) => state.openSortSheet)
  const filterCount = getFilterCount(filters)

  return (
    <section aria-label="Task controls" className="task-filter-bar">
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

      <div className="task-filter-bar__actions">
        <Button onClick={openFilterSheet} variant="secondary">
          <Filter aria-hidden="true" size={16} />
          Filter{filterCount ? ` (${filterCount})` : ''}
        </Button>
        <Button onClick={openSortSheet} variant="secondary">
          <ArrowDownUp aria-hidden="true" size={16} />
          Sort
        </Button>
      </div>

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

      <Sheet
        description="Choose how tasks are ordered in this view."
        onClose={closeSortSheet}
        open={isSortSheetOpen}
        title="Sort tasks"
      >
        <div className="task-sort-fields">
          <Select
            label="Sort by"
            onChange={(event) => onSortChange({ ...sort, field: event.target.value as TaskSort['field'] })}
            options={sortOptions}
            value={sort.field}
          />
          <Select
            label="Direction"
            onChange={(event) => onSortChange({ ...sort, direction: event.target.value as TaskSort['direction'] })}
            options={sortDirectionOptions}
            value={sort.direction}
          />
        </div>
        <div className="task-filter-sheet__actions">
          <Button onClick={closeSortSheet}>Apply sort</Button>
        </div>
      </Sheet>
    </section>
  )
}
