import { Badge } from '../../../components/ui/badge.tsx'
import type { TaskFilters } from '../types/task-query-types.ts'
import type { TeamMember } from '../types/task-types.ts'

interface TaskFilterSummaryProps {
  filters: TaskFilters
  members: readonly TeamMember[]
  search: string
}

function findMemberName(members: readonly TeamMember[], id: string) {
  return members.find((member) => member.id === id)?.name ?? 'Unknown member'
}

export function TaskFilterSummary({ filters, members, search }: TaskFilterSummaryProps) {
  const filtersInUse = [
    search ? `Search: ${search}` : null,
    filters.status !== 'all' ? `Status: ${filters.status.replace('-', ' ')}` : null,
    filters.priority !== 'all' ? `Priority: ${filters.priority}` : null,
    filters.dueDate !== 'all' ? `Due: ${filters.dueDate.replace('-', ' ')}` : null,
    filters.assigneeId === 'unassigned' ? 'Assignee: unassigned' : null,
    filters.assigneeId !== 'all' && filters.assigneeId !== 'unassigned'
      ? `Assignee: ${findMemberName(members, filters.assigneeId)}`
      : null,
  ].filter((filter): filter is string => filter !== null)

  if (!filtersInUse.length) {
    return null
  }

  return (
    <div aria-live="polite" className="task-filter-summary">
      <span>Showing:</span>
      <ul>
        {filtersInUse.map((filter) => <li key={filter}><Badge>{filter}</Badge></li>)}
      </ul>
    </div>
  )
}
