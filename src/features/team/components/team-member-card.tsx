import { Ellipsis, Mail, Phone, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../../components/ui/avatar.tsx'
import { appRoutes } from '../../../lib/navigation.ts'
import type { DirectoryEmployee } from '../types/team-directory-types.ts'

interface TeamMemberCardProps {
  employee: DirectoryEmployee
}

function getStatusLabel(status: DirectoryEmployee['status']) {
  return status === 'on-leave' ? 'On leave' : status.charAt(0).toUpperCase() + status.slice(1)
}

export function TeamMemberCard({ employee }: TeamMemberCardProps) {
  return (
    <article className="team-member-card">
      <header>
        <span className={`employee-status employee-status--${employee.status}`}><span aria-hidden="true" />{getStatusLabel(employee.status)}</span>
        <Link aria-label={`View ${employee.name}`} className="team-member-card__details-action" to={appRoutes.teamDetails(employee.id)}>
          <Ellipsis aria-hidden="true" size={17} />
        </Link>
      </header>
      <Link aria-label={`Open ${employee.name} employee details`} className="team-member-card__identity" to={appRoutes.teamDetails(employee.id)}>
        <Avatar name={employee.name} size="lg" {...(employee.avatarUrl ? { src: employee.avatarUrl } : {})} />
        <h3>{employee.name}</h3>
        <p>{employee.designation}</p>
      </Link>
      <footer>
        <a href={`mailto:${employee.email}`}><Mail aria-hidden="true" size={13} />{employee.email}</a>
        <a href={`tel:${employee.phone.replaceAll(' ', '')}`}><Phone aria-hidden="true" size={13} />{employee.phone}</a>
      </footer>
    </article>
  )
}

export function TeamMemberCardEmpty() {
  return (
    <article className="team-member-card team-member-card--empty">
      <UserRound aria-hidden="true" size={22} />
      <p>No employees match this view.</p>
    </article>
  )
}
