import { Plus } from 'lucide-react'
import { TeamMemberCard, TeamMemberCardEmpty } from './team-member-card.tsx'
import { employeeDepartments, type DirectoryEmployee, type EmployeeDepartment } from '../types/team-directory-types.ts'
import { groupEmployeesByDepartment } from '../utils/team-directory-utils.ts'

interface TeamDirectoryBoardProps {
  employees: readonly DirectoryEmployee[]
  onAddEmployee: (department: EmployeeDepartment) => void
  onOpenEmployee: (employeeId: string) => void
}

const departmentTone: Record<EmployeeDepartment, string> = {
  Design: 'violet',
  Development: 'blue',
  Management: 'amber',
  Marketing: 'pink',
}

export function TeamDirectoryBoard({ employees, onAddEmployee, onOpenEmployee }: TeamDirectoryBoardProps) {
  const groups = groupEmployeesByDepartment(employees)
  const visibleDepartments = employeeDepartments.filter((department) => (groups[department]?.length ?? 0) > 0)

  return (
    <section aria-label="Employee board" className="team-directory-board">
      {visibleDepartments.length ? visibleDepartments.map((department) => {
        const members = groups[department] ?? []

        return (
          <section className="team-department-column" key={department}>
            <header>
              <h2><span aria-hidden="true" className={`team-department-column__dot team-department-column__dot--${departmentTone[department]}`} />{department}</h2>
              <span>{String(members.length).padStart(2, '0')}</span>
              <button aria-label={`Add employee to ${department}`} onClick={() => onAddEmployee(department)} type="button">
                <Plus aria-hidden="true" size={18} />
              </button>
            </header>
            <div className="team-department-column__cards">
              {members.map((employee) => <TeamMemberCard employee={employee} key={employee.id} onOpen={onOpenEmployee} />)}
            </div>
          </section>
        )
      }) : <TeamMemberCardEmpty />}
    </section>
  )
}
