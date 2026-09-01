import { CircleAlert, ListTodo, TriangleAlert } from 'lucide-react'
import { Avatar } from '../../../components/ui/avatar.tsx'
import { Badge } from '../../../components/ui/badge.tsx'
import { Skeleton } from '../../../components/ui/skeleton.tsx'
import type { TeamMemberWorkload } from '../../tasks/api/task-service.ts'

interface TeamWorkspaceProps {
  members: readonly TeamMemberWorkload[]
}

export function TeamWorkspaceSkeleton() {
  return (
    <section aria-label="Loading team members" className="team-grid" role="status">
      <span className="sr-only">Loading team members</span>
      {Array.from({ length: 8 }, (_, index) => (
        <div className="team-card team-card--loading" key={index}>
          <Skeleton className="team-card__avatar-skeleton" shape="circle" />
          <div>
            <Skeleton className="team-card__name-skeleton" shape="line" />
            <Skeleton className="team-card__email-skeleton" shape="line" />
          </div>
          <Skeleton className="team-card__workload-skeleton" shape="line" />
        </div>
      ))}
    </section>
  )
}

export function TeamWorkspace({ members }: TeamWorkspaceProps) {
  return (
    <section aria-label="Team members" className="team-grid">
      {members.map((member) => (
        <article className="team-card" key={member.user.id}>
          <div className="team-card__identity">
            <Avatar name={member.user.name} size="md" />
            <div>
              <h2>{member.user.name}</h2>
              <p>{member.user.email}</p>
            </div>
          </div>
          <dl className="team-card__workload">
            <div>
              <dt><ListTodo aria-hidden="true" size={15} />Assigned</dt>
              <dd>{member.taskCount}</dd>
            </div>
            <div>
              <dt><CircleAlert aria-hidden="true" size={15} />Active</dt>
              <dd>{member.activeTaskCount}</dd>
            </div>
          </dl>
          {member.urgentTaskCount || member.overdueTaskCount ? (
            <div className="team-card__alerts">
              {member.urgentTaskCount ? <Badge tone="urgent"><TriangleAlert aria-hidden="true" size={12} />{member.urgentTaskCount} urgent</Badge> : null}
              {member.overdueTaskCount ? <Badge tone="danger">{member.overdueTaskCount} overdue</Badge> : null}
            </div>
          ) : (
            <p className="team-card__calm">No urgent work</p>
          )}
        </article>
      ))}
    </section>
  )
}
