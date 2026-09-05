import { ArrowRight, CalendarDays, CircleAlert, ClipboardCheck, ListTodo, Sparkles, UsersRound } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { LoadingState } from '../../components/feedback/loading-state.tsx'
import { Badge } from '../../components/ui/badge.tsx'
import { appRoutes } from '../../lib/navigation.ts'
import { defaultTaskListQuery } from '../tasks/api/task-service.ts'
import { TaskAssignee } from '../tasks/components/task-assignee.tsx'
import { TaskCreateControl } from '../tasks/components/task-create-control.tsx'
import { TaskPriorityBadge } from '../tasks/components/task-priority-badge.tsx'
import { useTaskList } from '../tasks/hooks/use-task-list.ts'
import type { TaskSummary } from '../tasks/types/task-query-types.ts'
import { formatTaskDueDate, isTaskOverdue } from '../tasks/utils/task-date-utils.ts'

interface HomeMetricProps {
  label: string
  tone: 'danger' | 'info' | 'neutral' | 'urgent'
  value: number
}

function HomeMetric({ label, tone, value }: HomeMetricProps) {
  return (
    <article className={`home-metric home-metric--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function HomeOverview({ summary }: { summary: TaskSummary }) {
  return (
    <section aria-label="Workspace overview" className="home-overview">
      <HomeMetric label="All work" tone="neutral" value={summary.total} />
      <HomeMetric label="Urgent" tone="urgent" value={summary.urgent} />
      <HomeMetric label="Overdue" tone="danger" value={summary.overdue} />
      <HomeMetric label="Unassigned" tone="info" value={summary.unassigned} />
    </section>
  )
}

const workspaceDestinations = [
  {
    description: 'Search, organize, and move work through the delivery flow.',
    icon: ListTodo,
    label: 'Task workspace',
    to: appRoutes.tasks,
  },
  {
    description: 'See due work in a focused day, week, or month schedule.',
    icon: CalendarDays,
    label: 'Calendar',
    to: appRoutes.calendar,
  },
  {
    description: 'Find the people behind the work and keep the directory current.',
    icon: UsersRound,
    label: 'Team directory',
    to: appRoutes.team,
  },
] as const

export function HomePage() {
  const query = useMemo(() => ({
    ...defaultTaskListQuery,
    pageSize: 6,
    sort: { direction: 'asc' as const, field: 'dueDate' as const },
  }), [])
  const { error, isInitialLoading, result, retry } = useTaskList(query)
  const membersById = new Map(result?.members.map((member) => [member.id, member]))

  return (
    <section className="page page--home">
      <header className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow"><Sparkles aria-hidden="true" size={15} />Team workspace</p>
          <h1>Plan clearly. Ship confidently.</h1>
          <p className="home-hero__description">Keep priorities visible, give every task a clear owner, and help the team move work forward without the spreadsheet noise.</p>
          <div className="home-hero__actions">
            {result ? <TaskCreateControl label="Create task" members={result.members} /> : null}
            <Link className="button button--secondary button--md" to={appRoutes.tasks}>
              Open tasks <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
        <div className="home-hero__status">
          <ClipboardCheck aria-hidden="true" size={21} />
          <div><strong>One source of truth</strong><span>Tasks, deadlines, and owners stay connected.</span></div>
        </div>
      </header>

      {isInitialLoading ? <LoadingState context="section" message="Preparing your workspace overview" /> : null}
      {error && !result ? <ErrorState description="The workspace overview could not be loaded. Please retry." onRetry={retry} title="Unable to load your workspace" /> : null}

      {result ? (
        <>
          <HomeOverview summary={result.summary} />

          <div className="home-layout">
            <section className="home-focus" aria-labelledby="home-focus-title">
              <header className="home-section-heading">
                <div><p>Focus now</p><h2 id="home-focus-title">Tasks that need attention</h2></div>
                <Link to={appRoutes.tasks}>View all <ArrowRight aria-hidden="true" size={15} /></Link>
              </header>
              <ul className="home-task-list">
                {result.items.map((task) => {
                  const assignee = task.assigneeId ? membersById.get(task.assigneeId) : undefined
                  const overdue = isTaskOverdue(task)

                  return (
                    <li key={task.id}>
                      <Link to={appRoutes.taskDetails(task.id)}>
                        <div className="home-task__main">
                          <span aria-hidden="true" className={`home-task__status home-task__status--${task.status}`} />
                          <div><h3>{task.title}</h3><TaskAssignee assignee={assignee} /></div>
                        </div>
                        <div className="home-task__meta">
                          <TaskPriorityBadge priority={task.priority} />
                          <span className={overdue ? 'home-task__date home-task__date--overdue' : 'home-task__date'}>{formatTaskDueDate(task.dueDate)}</span>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>

            <aside className="home-workspace-links" aria-labelledby="home-workspace-title">
              <header className="home-section-heading"><div><p>Workspace</p><h2 id="home-workspace-title">Everything in reach</h2></div></header>
              <div>
                {workspaceDestinations.map(({ description, icon: Icon, label, to }) => (
                  <Link className="home-workspace-link" key={to} to={to}>
                    <span className="home-workspace-link__icon"><Icon aria-hidden="true" size={18} /></span>
                    <span><strong>{label}</strong><small>{description}</small></span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                ))}
              </div>
              <div className="home-workspace-links__tip"><CircleAlert aria-hidden="true" size={16} /><p><strong>Stay on top of risk.</strong> Urgent, overdue, and unassigned work is surfaced above so nothing gets lost.</p></div>
            </aside>
          </div>

          <section aria-label="Workflow guide" className="home-workflow">
            <div><Badge tone="info">Built for momentum</Badge><h2>From idea to done, without losing context.</h2></div>
            <ol>
              <li><span>01</span><strong>Capture</strong><p>Create a clear task with an owner and a due date.</p></li>
              <li><span>02</span><strong>Move</strong><p>Use Kanban or a status control to keep the workflow current.</p></li>
              <li><span>03</span><strong>Share</strong><p>Send a filtered link so teammates see the same view.</p></li>
            </ol>
          </section>
        </>
      ) : null}
    </section>
  )
}
