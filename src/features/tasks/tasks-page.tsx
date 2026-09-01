import { ListTodo } from 'lucide-react'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { TaskFilterBar } from './components/task-filter-bar.tsx'
import { TaskFilterSummary } from './components/task-filter-summary.tsx'
import { TaskCreateControl } from './components/task-create-control.tsx'
import { TaskList } from './components/task-list.tsx'
import { TaskListControls } from './components/task-list-controls.tsx'
import { TaskListSkeleton } from './components/task-list-skeleton.tsx'
import { TaskSummary } from './components/task-summary.tsx'
import { useTaskList } from './hooks/use-task-list.ts'
import { useTaskQueryParams } from './hooks/use-task-query-params.ts'

export function TasksPage() {
  const { clearView, query, setFilters, setPage, setSearch, setSort } = useTaskQueryParams()
  const { error, isLoading, result, retry } = useTaskList(query)

  return (
    <section className="page">
      <PageIntro
        description="A shared, focused view of the work your team needs to move forward."
        eyebrow="Work queue"
        title="Tasks"
      >
        {result ? <TaskCreateControl members={result.members} onCreated={retry} /> : null}
      </PageIntro>

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
            filters={query.filters}
            members={result.members}
            onClear={clearView}
            onFiltersChange={setFilters}
            onSearchChange={setSearch}
            search={query.search}
          />
          <TaskFilterSummary filters={query.filters} members={result.members} search={query.search} />
          {result.items.length ? (
            <>
              <TaskList members={result.members} tasks={result.items} />
              <TaskListControls
                onPageChange={setPage}
                onSortChange={setSort}
                pagination={result.pagination}
                sort={query.sort}
              />
            </>
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
