import { ListTodo } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { defaultTaskFilters, defaultTaskListQuery } from './api/task-service.ts'
import { TaskFilterBar } from './components/task-filter-bar.tsx'
import { TaskFilterSummary } from './components/task-filter-summary.tsx'
import { TaskList } from './components/task-list.tsx'
import { TaskListSkeleton } from './components/task-list-skeleton.tsx'
import { TaskSummary } from './components/task-summary.tsx'
import { useTaskList } from './hooks/use-task-list.ts'
import type { TaskFilters } from './types/task-query-types.ts'

export function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>(() => ({ ...defaultTaskFilters }))
  const [search, setSearch] = useState('')
  const taskQuery = useMemo(() => ({ ...defaultTaskListQuery, filters, search }), [filters, search])
  const { error, isLoading, result, retry } = useTaskList(taskQuery)

  const clearFilters = () => {
    setFilters({ ...defaultTaskFilters })
    setSearch('')
  }

  return (
    <section className="page">
      <PageIntro
        description="A shared, focused view of the work your team needs to move forward."
        eyebrow="Work queue"
        title="Tasks"
      />

      {isLoading ? <TaskListSkeleton /> : null}

      {error ? (
        <ErrorState
          description="Something went wrong while loading the task list. Your work has not been changed."
          onRetry={retry}
          title="Unable to load tasks"
        />
      ) : null}

      {result ? (
        <div className="task-workspace">
          <TaskSummary summary={result.summary} />
          <TaskFilterBar
            currentMemberId={result.currentMemberId}
            filters={filters}
            members={result.members}
            onClear={clearFilters}
            onFiltersChange={setFilters}
            onSearchChange={setSearch}
            search={search}
          />
          <TaskFilterSummary filters={filters} members={result.members} search={search} />
          {result.items.length ? (
            <TaskList members={result.members} tasks={result.items} />
          ) : (
            <EmptyState
              description="Try changing your filters or search to see work in this workspace."
              icon={<ListTodo aria-hidden="true" size={24} />}
              title="No tasks match this view"
            />
          )}
        </div>
      ) : null}
    </section>
  )
}
