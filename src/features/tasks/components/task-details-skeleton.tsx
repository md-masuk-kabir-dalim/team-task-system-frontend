import { Skeleton } from '@/shared/components/ui/skeleton.tsx'

export function TaskDetailsSkeleton() {
  return (
    <section aria-label="Loading task details" className="task-details task-details--loading" role="status">
      <span className="sr-only">Loading task details</span>
      <Skeleton className="task-details-skeleton__title" shape="line" />
      <Skeleton className="task-details-skeleton__description" shape="line" />
      <Skeleton className="task-details-skeleton__description" shape="line" />
      <div className="task-details-skeleton__grid">
        {Array.from({ length: 4 }, (_, index) => <Skeleton className="task-details-skeleton__card" key={index} />)}
      </div>
    </section>
  )
}
