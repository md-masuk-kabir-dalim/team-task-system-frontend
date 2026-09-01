import { Ellipsis, Mail, Phone, UserRound } from 'lucide-react'
import { Avatar } from '../../../components/ui/avatar.tsx'
import { IconButton } from '../../../components/ui/icon-button.tsx'
import type { DirectoryEmployee } from '../types/team-directory-types.ts'

interface TeamMemberCardProps {
  employee: DirectoryEmployee
  onOpen: (employeeId: string) => void
}

function getStatusLabel(status: DirectoryEmployee['status']) {
  return status === 'on-leave' ? 'On leave' : status.charAt(0).toUpperCase() + status.slice(1)
}

export function TeamMemberCard({ employee, onOpen }: TeamMemberCardProps) {
  return (
    <article className="team-member-card">
      <header>
        <span className={`employee-status employee-status--${employee.status}`}><span aria-hidden="true" />{getStatusLabel(employee.status)}</span>
        <IconButton label={`View ${employee.name}`} onClick={() => onOpen(employee.id)} variant="ghost">
          <Ellipsis aria-hidden="true" size={17} />
        </IconButton>
      </header>
      <div className="team-member-card__identity">
        <Avatar name={employee.name} size="lg" {...(employee.avatarUrl ? { src: employee.avatarUrl } : {})} />
        <h3>{employee.name}</h3>
        <p>{employee.designation}</p>
      </div>
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
