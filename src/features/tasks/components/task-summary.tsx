import { CircleAlert, ListTodo, UserRoundX } from 'lucide-react'
import type { TaskSummary as TaskSummaryData } from '../types/task-query-types.ts'

interface TaskSummaryProps {
  summary: TaskSummaryData
}

export function TaskSummary({ summary }: TaskSummaryProps) {
  const summaryItems = [
    { icon: ListTodo, label: 'All work', value: summary.total },
    { icon: CircleAlert, label: 'Urgent', value: summary.urgent },
    { icon: CircleAlert, label: 'Overdue', value: summary.overdue },
    { icon: UserRoundX, label: 'Unassigned', value: summary.unassigned },
  ] as const

  return (
    <section aria-label="Task summary" className="task-summary">
      {summaryItems.map(({ icon: Icon, label, value }) => (
        <article className="task-summary__item" key={label}>
          <Icon aria-hidden="true" size={18} />
          <div>
            <p>{label}</p>
            <strong>{value}</strong>
          </div>
        </article>
      ))}
    </section>
  )
}
