import { Mail, Phone, X } from 'lucide-react'
import { Avatar } from '../../../components/ui/avatar.tsx'
import { IconButton } from '../../../components/ui/icon-button.tsx'
import type { DirectoryEmployee } from '../types/team-directory-types.ts'
import { formatEmployeeDate } from '../utils/team-directory-utils.ts'

interface TeamMemberInspectorProps {
  employee: DirectoryEmployee
  onClose: () => void
}

export function TeamMemberInspector({ employee, onClose }: TeamMemberInspectorProps) {
  return (
    <aside aria-label={`${employee.name} profile`} className="team-member-inspector">
      <header>
        <span>Employee profile</span>
        <IconButton label="Close employee profile" onClick={onClose} variant="ghost"><X aria-hidden="true" size={17} /></IconButton>
      </header>
      <div className="team-member-inspector__identity">
        <Avatar name={employee.name} size="lg" {...(employee.avatarUrl ? { src: employee.avatarUrl } : {})} />
        <div>
          <h2>{employee.name}</h2>
          <p>{employee.designation}</p>
        </div>
      </div>
      <dl>
        <div><dt>Department</dt><dd>{employee.department}</dd></div>
        <div><dt>Employee ID</dt><dd>#{employee.id}</dd></div>
        <div><dt>Joined</dt><dd>{formatEmployeeDate(employee.joinDate)}</dd></div>
      </dl>
      <footer>
        <a href={`mailto:${employee.email}`}><Mail aria-hidden="true" size={15} />Email</a>
        <a href={`tel:${employee.phone.replaceAll(' ', '')}`}><Phone aria-hidden="true" size={15} />Call</a>
      </footer>
    </aside>
  )
}
