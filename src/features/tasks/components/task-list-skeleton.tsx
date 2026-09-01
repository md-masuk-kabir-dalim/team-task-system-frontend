import { Skeleton } from '../../../components/ui/skeleton.tsx'

export function TaskListSkeleton() {
  return (
    <section aria-label="Loading task list" className="task-list task-list--loading" role="status">
      <span className="sr-only">Loading tasks</span>
      {Array.from({ length: 7 }, (_, index) => (
        <div className="task-list-skeleton__row" key={index}>
          <Skeleton className="task-list-skeleton__title" shape="line" />
          <Skeleton className="task-list-skeleton__metadata" shape="line" />
          <Skeleton className="task-list-skeleton__metadata" shape="line" />
          <Skeleton className="task-list-skeleton__assignee" shape="line" />
          <Skeleton className="task-list-skeleton__metadata" shape="line" />
        </div>
      ))}
    </section>
  )
}
