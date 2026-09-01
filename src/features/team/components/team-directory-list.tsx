import { Eye, Mail } from 'lucide-react'
import { Avatar } from '../../../components/ui/avatar.tsx'
import { IconButton } from '../../../components/ui/icon-button.tsx'
import type { DirectoryEmployee } from '../types/team-directory-types.ts'
import { formatEmployeeDate } from '../utils/team-directory-utils.ts'

interface TeamDirectoryListProps {
  employees: readonly DirectoryEmployee[]
  onOpenEmployee: (employeeId: string) => void
  onToggleEmployee: (employeeId: string) => void
  onToggleVisible: () => void
  selectedEmployeeIds: readonly string[]
}

function getStatusLabel(status: DirectoryEmployee['status']) {
  return status === 'on-leave' ? 'On leave' : status.charAt(0).toUpperCase() + status.slice(1)
}

export function TeamDirectoryList({
  employees,
  onOpenEmployee,
  onToggleEmployee,
  onToggleVisible,
  selectedEmployeeIds,
}: TeamDirectoryListProps) {
  const allSelected = employees.length > 0 && employees.every((employee) => selectedEmployeeIds.includes(employee.id))

  return (
    <section className="team-directory-list" aria-label="Employee list">
      <div className="team-directory-list__table" role="region" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col"><input aria-label="Select visible employees" checked={allSelected} onChange={onToggleVisible} type="checkbox" /></th>
              <th scope="col">Employee ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Department</th>
              <th scope="col">Designation</th>
              <th scope="col">Join date</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td><input aria-label={`Select ${employee.name}`} checked={selectedEmployeeIds.includes(employee.id)} onChange={() => onToggleEmployee(employee.id)} type="checkbox" /></td>
                <td><button className="team-directory-list__id" onClick={() => onOpenEmployee(employee.id)} type="button">#{employee.id}</button></td>
                <td>
                  <button className="team-directory-list__person" onClick={() => onOpenEmployee(employee.id)} type="button">
                    <Avatar name={employee.name} size="sm" {...(employee.avatarUrl ? { src: employee.avatarUrl } : {})} />
                    <span>{employee.name}</span>
                  </button>
                </td>
                <td><a href={`mailto:${employee.email}`}>{employee.email}</a></td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>{formatEmployeeDate(employee.joinDate)}</td>
                <td><span className={`employee-status employee-status--${employee.status}`}><span aria-hidden="true" />{getStatusLabel(employee.status)}</span></td>
                <td className="team-directory-list__actions">
                  <IconButton label={`Inspect ${employee.name}`} onClick={() => onOpenEmployee(employee.id)} variant="ghost"><Eye aria-hidden="true" size={16} /></IconButton>
                  <IconButton label={`Email ${employee.name}`} onClick={() => globalThis.location.assign(`mailto:${employee.email}`)} variant="ghost"><Mail aria-hidden="true" size={16} /></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!employees.length ? <p className="team-directory-list__empty">No employees match the current filters.</p> : null}
    </section>
  )
}
