import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ } from 'lucide-react'
import { Button } from '../../../components/ui/button.tsx'
import { Pagination } from '../../../components/ui/pagination.tsx'
import { Select } from '../../../components/ui/select.tsx'
import type { PaginationMetadata, TaskSort } from '../types/task-query-types.ts'

const sortOptions = [
  { label: 'Due date', value: 'dueDate' },
  { label: 'Priority', value: 'priority' },
  { label: 'Created date', value: 'createdAt' },
  { label: 'Updated date', value: 'updatedAt' },
  { label: 'Title', value: 'title' },
] as const

interface TaskListControlsProps {
  onPageChange: (page: number) => void
  onSortChange: (sort: TaskSort) => void
  pagination: PaginationMetadata
  sort: TaskSort
}

export function TaskListControls({ onPageChange, onSortChange, pagination, sort }: TaskListControlsProps) {
  const toggleDirection = () => {
    onSortChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' })
  }

  const directionLabel = sort.direction === 'asc' ? 'Ascending' : 'Descending'
  const DirectionIcon = sort.field === 'title'
    ? sort.direction === 'asc' ? ArrowUpAZ : ArrowDownAZ
    : ArrowDownUp

  return (
    <footer className="task-list-controls">
      <p>
        Showing <strong>{pagination.totalItems ? (pagination.page - 1) * pagination.pageSize + 1 : 0}–{Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}</strong> of {pagination.totalItems} tasks
      </p>
      <div className="task-list-controls__actions">
        <Select
          label="Sort by"
          onChange={(event) => onSortChange({ ...sort, field: event.target.value as TaskSort['field'] })}
          options={sortOptions}
          value={sort.field}
        />
        <Button aria-label={`Sort ${directionLabel.toLowerCase()}`} onClick={toggleDirection} size="icon" variant="outline">
          <DirectionIcon aria-hidden="true" size={17} />
        </Button>
      </div>
      <Pagination currentPage={pagination.page} onPageChange={onPageChange} totalPages={pagination.pageCount} />
    </footer>
  )
}
