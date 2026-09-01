import { ListTodo } from 'lucide-react'
import { useMemo } from 'react'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { defaultTaskListQuery } from './api/task-service.ts'
import { TaskList } from './components/task-list.tsx'
import { TaskListSkeleton } from './components/task-list-skeleton.tsx'
import { TaskSummary } from './components/task-summary.tsx'
import { useTaskList } from './hooks/use-task-list.ts'

export function TasksPage() {
  const taskQuery = useMemo(() => defaultTaskListQuery, [])
  const { error, isLoading, result, retry } = useTaskList(taskQuery)

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
