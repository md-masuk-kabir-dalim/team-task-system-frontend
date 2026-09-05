import { Pagination } from '@/shared/components/ui/pagination.tsx'
import type { PaginationMetadata } from '../types/task-query-types.ts'

interface TaskListControlsProps {
  onPageChange: (page: number) => void
  pagination: PaginationMetadata
}

export function TaskListControls({ onPageChange, pagination }: TaskListControlsProps) {
  const firstItem = pagination.totalItems ? (pagination.page - 1) * pagination.pageSize + 1 : 0
  const lastItem = Math.min(pagination.page * pagination.pageSize, pagination.totalItems)

  return (
    <footer className="task-list-controls">
      <p>
        Showing <strong>{firstItem}&ndash;{lastItem}</strong> of {pagination.totalItems} tasks
      </p>
      <Pagination currentPage={pagination.page} onPageChange={onPageChange} totalPages={pagination.pageCount} />
    </footer>
  )
}
