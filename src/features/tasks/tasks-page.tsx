import { ListTodo } from 'lucide-react'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { Button } from '../../components/ui/button.tsx'
import { TaskBoard } from './components/task-board.tsx'
import { TaskCreateControl } from './components/task-create-control.tsx'
import { TaskFilterBar } from './components/task-filter-bar.tsx'
import { TaskFilterSummary } from './components/task-filter-summary.tsx'
import { TaskList } from './components/task-list.tsx'
import { TaskListControls } from './components/task-list-controls.tsx'
import { TaskListSkeleton } from './components/task-list-skeleton.tsx'
import { TaskTimeline } from './components/task-timeline.tsx'
import { TaskViewTabs } from './components/task-view-tabs.tsx'
import { useTaskList } from './hooks/use-task-list.ts'
import { useTaskQueryParams } from './hooks/use-task-query-params.ts'

export function TasksPage() {
  const { clearView, query, setFilters, setPage, setSearch, setSort, setView } = useTaskQueryParams()
  const { error, isInitialLoading, isRefreshing, result, retry } = useTaskList(query)

  return (
    <section className="page page--tasks">
      <header className="task-page-header">
        <div className="task-page-header__heading">
          <p>Workspace</p>
          <h1>Task Design</h1>
          <span>Manage and track your team&apos;s project tasks.</span>
        </div>

        {result ? (
          <div className="task-page-header__create">
            <TaskCreateControl members={result.members} onCreated={retry} />
          </div>
        ) : null}

        <div className="task-page-header__toolbar">
          <TaskViewTabs onViewChange={setView} view={query.view} />
          {result ? (
            <TaskFilterBar
              filters={query.filters}
              members={result.members}
              onClear={clearView}
              onFiltersChange={setFilters}
              onSearchChange={setSearch}
              onSortChange={setSort}
              search={query.search}
              sort={query.sort}
            />
          ) : null}
        </div>
      </header>

      {isInitialLoading ? <TaskListSkeleton /> : null}

      {error && !result ? (
        <ErrorState
          description="Something went wrong while loading the task list. Your work has not been changed."
          onRetry={retry}
          title="Unable to load tasks"
        />
      ) : null}

      {result ? (
        <div aria-busy={isRefreshing || undefined} className="task-workspace" id="task-view-content">
          {error ? (
            <section aria-live="assertive" className="task-workspace__refresh-error" role="alert">
              <p>We couldn&apos;t update this view. You are seeing the last loaded task list.</p>
              <Button onClick={retry} size="sm" variant="secondary">Retry</Button>
            </section>
          ) : null}
          <TaskFilterSummary filters={query.filters} members={result.members} search={query.search} />
          {isRefreshing ? <p aria-live="polite" className="task-workspace__refreshing">Updating task view&hellip;</p> : null}
          {result.items.length ? (
            query.view === 'board' ? <TaskBoard members={result.members} tasks={result.items} />
              : query.view === 'timeline' ? <TaskTimeline members={result.members} tasks={result.items} />
                : (
                    <>
                      <TaskList members={result.members} tasks={result.items} />
                      <TaskListControls onPageChange={setPage} pagination={result.pagination} />
                    </>
                  )
          ) : (
            <EmptyState
              description="Try changing your filters or search to see work in this workspace."
              icon={<ListTodo aria-hidden="true" size={24} />}
              primaryAction={<Button onClick={clearView} variant="secondary">Clear view</Button>}
              title="No tasks match this view"
            />
          )}
        </div>
      ) : null}
    </section>
  )
}
