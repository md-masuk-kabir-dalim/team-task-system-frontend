import { ArrowDownUp, Filter, ListTodo, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button.tsx'
import { Select } from '@/shared/components/ui/select.tsx'
import { Sheet } from '@/shared/components/ui/sheet.tsx'
import { appRoutes } from '@/app/navigation.ts'
import { useUiStore } from '@/app/stores/ui-store.ts'
import { defaultTaskListQuery, listTasks, type TaskListResult } from '../api/task-service.ts'
import type { DueDateFilter, TaskFilters, TaskSort } from '../types/task-query-types.ts'
import type { TaskPriority, TaskStatus, TeamMember } from '../types/task-types.ts'

const statusOptions = [
  { label: 'All statuses', value: 'all' },
  { label: 'To do', value: 'todo' },
  { label: 'In progress', value: 'in-progress' },
  { label: 'In review', value: 'review' },
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

interface TaskSearchControlProps {
  onSearchChange: (search: string) => void
  search: string
}

function TaskSearchControl({ onSearchChange, search }: TaskSearchControlProps) {
  const navigate = useNavigate()
  const [suggestionResult, setSuggestionResult] = useState<TaskListResult | null>(null)
  const [isSearching, setIsSearching] = useState(Boolean(search.trim()))
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const requestIdRef = useRef(0)
  const suggestionListId = useId()
  const normalizedSearch = search.trim()
  const suggestions = suggestionResult?.items ?? []
  const membersById = new Map(suggestionResult?.members.map((member) => [member.id, member]))

  useEffect(() => {
    const requestId = ++requestIdRef.current

    if (!normalizedSearch) {
      return undefined
    }

    const timer = globalThis.setTimeout(() => {
      void listTasks({
        ...defaultTaskListQuery,
        pageSize: 5,
        search: normalizedSearch,
      }, { delayMs: 140 }).then((result) => {
        if (requestId === requestIdRef.current) {
          setSuggestionResult(result)
          setIsSearching(false)
        }
      }).catch(() => {
        if (requestId === requestIdRef.current) {
          setSuggestionResult(null)
          setIsSearching(false)
        }
      })
    }, 180)

    return () => globalThis.clearTimeout(timer)
  }, [normalizedSearch])

  const openTask = (taskId: string) => {
    setIsSuggestionsOpen(false)
    navigate(appRoutes.taskDetails(taskId))
  }

  return (
    <div
      className="task-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsSuggestionsOpen(false)
        }
      }}
    >
      <Search aria-hidden="true" size={18} />
      <label className="sr-only" htmlFor="task-search">Search tasks</label>
      <input
        aria-autocomplete="list"
        aria-controls={normalizedSearch ? suggestionListId : undefined}
        aria-expanded={isSuggestionsOpen && Boolean(normalizedSearch)}
        id="task-search"
        onChange={(event) => {
          const nextSearch = event.target.value
          const canSearch = Boolean(nextSearch.trim())
          onSearchChange(nextSearch)
          setSuggestionResult(null)
          setIsSearching(canSearch)
          setIsSuggestionsOpen(canSearch)
        }}
        onFocus={() => setIsSuggestionsOpen(Boolean(normalizedSearch))}
        placeholder="Search tasks, descriptions, or people"
        type="search"
        value={search}
      />
      {isSuggestionsOpen && normalizedSearch ? (
        <section aria-label="Task search suggestions" className="task-search__suggestions" id={suggestionListId}>
          {isSearching ? <p>Searching tasks…</p> : null}
          {!isSearching && suggestions.length ? (
            <ul>
              {suggestions.map((task) => {
                const assignee = task.assigneeId ? membersById.get(task.assigneeId) : undefined

                return (
                  <li key={task.id}>
                    <button onClick={() => openTask(task.id)} type="button">
                      <ListTodo aria-hidden="true" size={15} />
                      <span><strong>{task.title}</strong><small>{assignee?.name ?? 'Unassigned'} · {task.status.replace('-', ' ')}</small></span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
          {!isSearching && !suggestions.length ? <p>No task or owner matches “{normalizedSearch}”.</p> : null}
        </section>
      ) : null}
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
      <TaskSearchControl onSearchChange={onSearchChange} search={search} />

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
