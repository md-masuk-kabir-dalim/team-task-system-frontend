import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { appRoutes } from '../../lib/navigation.ts'
import { TaskDetails } from './components/task-details.tsx'
import { TaskDetailsSkeleton } from './components/task-details-skeleton.tsx'
import { useTaskDetail } from './hooks/use-task-detail.ts'

export function TaskDetailsPage() {
  const { taskId } = useParams()
  const { detail, error, isLoading, retry } = useTaskDetail(taskId)

  return (
    <section className="page">
      <PageIntro
        description="Review the context and ownership behind this piece of work."
        eyebrow="Task workspace"
        title="Task details"
      />

      {isLoading ? <TaskDetailsSkeleton /> : null}
      {error ? (
        <ErrorState
          description="Something went wrong while loading this task. Please try again."
          onRetry={retry}
          title="Unable to load task details"
        />
      ) : null}
      {detail ? <TaskDetails members={detail.members} task={detail.task} /> : null}
      {!isLoading && !error && !detail ? (
        <EmptyState
          description="The task may have been removed or the link is incomplete."
          icon={<FileQuestion aria-hidden="true" size={24} />}
          primaryAction={(
            <Link className="text-link" to={appRoutes.tasks}>
              <ArrowLeft aria-hidden="true" size={17} />
              Back to Tasks
            </Link>
          )}
          title="Task not found"
        />
      ) : null}
    </section>
  )
}
