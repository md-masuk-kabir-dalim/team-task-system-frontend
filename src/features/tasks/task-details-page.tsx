import { ArrowLeft, ChevronRight, FileQuestion } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { appRoutes } from '../../lib/navigation.ts'
import { useTaskStore } from '../../stores/task-store.ts'
import type { UpdateTaskInput } from './api/task-service.ts'
import { TaskDetails } from './components/task-details.tsx'
import { TaskDetailsSkeleton } from './components/task-details-skeleton.tsx'
import { useTaskDetail } from './hooks/use-task-detail.ts'

export function TaskDetailsPage() {
  const { taskId } = useParams()
  const { detail, error, isLoading, retry } = useTaskDetail(taskId)
  const updateTask = useTaskStore((state) => state.updateTask)
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus)

  const handleStatusChange = async (status: NonNullable<typeof detail>['task']['status']) => {
    if (!taskId) {
      throw new Error('A task identifier is required to update the workflow.')
    }

    await updateTaskStatus(taskId, status)
  }

  const handleTaskUpdate = async (input: UpdateTaskInput) => {
    if (!taskId) {
      throw new Error('A task identifier is required to update this task.')
    }

    await updateTask(taskId, input)
  }

  return (
    <section className="page task-details-page">
      <nav aria-label="Breadcrumb" className="task-details-page__breadcrumb">
        <Link to={appRoutes.tasks}>
          <ArrowLeft aria-hidden="true" size={14} />
          Tasks
        </Link>
        <ChevronRight aria-hidden="true" size={14} />
        <span>Task details</span>
      </nav>

      {isLoading ? <TaskDetailsSkeleton /> : null}
      {error ? (
        <ErrorState
          description="Something went wrong while loading this task. Please try again."
          onRetry={retry}
          title="Unable to load task details"
        />
      ) : null}
      {detail ? (
        <TaskDetails
          members={detail.members}
          onStatusChange={handleStatusChange}
          onTaskUpdate={handleTaskUpdate}
          task={detail.task}
        />
      ) : null}
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
