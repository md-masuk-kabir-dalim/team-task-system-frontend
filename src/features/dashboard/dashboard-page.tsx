import { ArrowUpRight, CalendarDays, CircleAlert } from 'lucide-react'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { Badge } from '../../components/ui/badge.tsx'

export function DashboardPage() {
  return (
    <section className="page">
      <PageIntro
        description="A calm, reliable view of the work that needs your team’s attention."
        eyebrow="Overview"
        title="Keep work moving"
      />

      <div className="foundation-grid" aria-label="Workspace readiness">
        <article className="foundation-card foundation-card--primary">
          <div className="foundation-card__icon">
            <ArrowUpRight aria-hidden="true" size={19} />
          </div>
          <Badge tone="info">Foundation ready</Badge>
          <h3>Task visibility begins here</h3>
          <p>Next, the dashboard will surface team workload, active work, and deadlines from the task service.</p>
        </article>

        <article className="foundation-card">
          <CalendarDays aria-hidden="true" className="foundation-card__symbol" size={20} />
          <p className="foundation-card__label">Planned view</p>
          <h3>Due dates at a glance</h3>
          <p>Upcoming and overdue work will be easy to scan without adding noise to the workflow.</p>
        </article>

        <article className="foundation-card">
          <CircleAlert aria-hidden="true" className="foundation-card__symbol" size={20} />
          <p className="foundation-card__label">Planned view</p>
          <h3>Clear ownership signals</h3>
          <p>Unassigned and urgent tasks will be visible early, so work does not get lost in a spreadsheet.</p>
        </article>
      </div>
    </section>
  )
}
