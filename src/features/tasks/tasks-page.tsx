import { ListFilter, Search } from 'lucide-react'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { Badge } from '../../components/ui/badge.tsx'

export function TasksPage() {
  return (
    <section className="page">
      <PageIntro
        description="Find, prioritize, and move work through a shared, trustworthy workflow."
        eyebrow="Work queue"
        title="Tasks"
      />

      <section className="feature-placeholder" aria-labelledby="task-workspace-title">
        <div className="feature-placeholder__icon"><Search aria-hidden="true" size={22} /></div>
        <div>
          <div className="feature-placeholder__heading">
            <h3 id="task-workspace-title">Task workspace is being prepared</h3>
            <Badge tone="todo">Next phase</Badge>
          </div>
          <p>The responsive list, search, filters, and URL-driven views will connect here once realistic task data is introduced.</p>
        </div>
        <ListFilter aria-hidden="true" className="feature-placeholder__trailing-icon" size={22} />
      </section>
    </section>
  )
}
