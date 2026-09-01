import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { Avatar } from '../../../components/ui/avatar.tsx'
import { appRoutes } from '../../../lib/navigation.ts'
import { getTimeLabel } from '../utils/calendar-utils.ts'
import type { CalendarTaskEvent } from '../types/calendar-types.ts'
import type { TeamMember } from '../../tasks/types/task-types.ts'

interface CalendarEventCardProps {
  compact?: boolean
  event: CalendarTaskEvent
  membersById: ReadonlyMap<string, TeamMember>
  style?: CSSProperties
}

export function CalendarEventCard({ compact = false, event, membersById, style }: CalendarEventCardProps) {
  const assignee = event.task.assigneeId ? membersById.get(event.task.assigneeId) : undefined

  return (
    <Link
      aria-label={`Open ${event.task.title}`}
      className={`calendar-event-card calendar-event-card--${event.category}${compact ? ' calendar-event-card--compact' : ''}`}
      style={style}
      to={appRoutes.taskDetails(event.task.id)}
    >
      <span className="calendar-event-card__time"><CalendarDays aria-hidden="true" size={10} />{getTimeLabel(event.startMinutes)} – {getTimeLabel(event.endMinutes)}</span>
      <strong>{event.task.title}</strong>
      {!compact ? <span className="calendar-event-card__assignee"><Avatar name={assignee?.name ?? 'Unassigned'} size="sm" {...(assignee?.avatarUrl ? { src: assignee.avatarUrl } : {})} /></span> : null}
    </Link>
  )
}
