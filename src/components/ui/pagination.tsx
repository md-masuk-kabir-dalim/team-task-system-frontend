import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from './button.tsx'

type PaginationItem = 'ellipsis' | number

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

export function Pagination({ currentPage, onPageChange, totalPages }: PaginationProps) {
  if (totalPages < 2) {
    return null
  }

  const pageItems = getPaginationItems(currentPage, totalPages)
  const previousDisabled = currentPage <= 1
  const nextDisabled = currentPage >= totalPages

  return (
    <nav aria-label="Pagination" className="pagination">
      <Button
        aria-label="Previous page"
        disabled={previousDisabled}
        onClick={() => onPageChange(currentPage - 1)}
        size="icon"
        variant="outline"
      >
        <ChevronLeft aria-hidden="true" size={18} />
      </Button>
      <ol className="pagination__pages">
        {pageItems.map((item, index) => (
          <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <span aria-hidden="true" className="pagination__ellipsis"><MoreHorizontal size={18} /></span>
            ) : (
              <Button
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={`Page ${item}`}
                onClick={() => onPageChange(item)}
                size="icon"
                variant={item === currentPage ? 'primary' : 'outline'}
              >
                {item}
              </Button>
            )}
          </li>
        ))}
      </ol>
      <Button
        aria-label="Next page"
        disabled={nextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        size="icon"
        variant="outline"
      >
        <ChevronRight aria-hidden="true" size={18} />
      </Button>
    </nav>
  )
}
