import { FileText } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { Badge } from '../../components/ui/badge.tsx'

export function TaskDetailsPage() {
  const { taskId } = useParams()

  return (
    <section className="page">
      <PageIntro
        description="Task details will use the same shared service and feedback patterns as the task list."
        eyebrow="Task workspace"
        title="Task details"
      />

      <section className="feature-placeholder" aria-label="Task detail placeholder">
        <div className="feature-placeholder__icon"><FileText aria-hidden="true" size={22} /></div>
        <div>
          <div className="feature-placeholder__heading">
            <h3>Details route is ready</h3>
            <Badge tone="neutral">{taskId ?? 'No task selected'}</Badge>
          </div>
          <p>Data loading, editing, and status changes will be added after the task data layer is established.</p>
        </div>
      </section>
    </section>
  )
}
