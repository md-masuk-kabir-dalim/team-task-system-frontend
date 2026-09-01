import type { DirectoryEmployee, EmployeeDepartment, EmployeeStatus } from '../types/team-directory-types.ts'

export function formatEmployeeDate(value: string) {
  return new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

export function getEmployeeStats(employees: readonly DirectoryEmployee[]) {
  const countByStatus = (status: EmployeeStatus) => employees.filter((employee) => employee.status === status).length

  return {
    active: countByStatus('active'),
    newJoiners: employees.filter((employee) => employee.joinDate >= '2024-06-01').length,
    onLeave: countByStatus('on-leave'),
    total: employees.length,
  }
}

export function filterEmployees(
  employees: readonly DirectoryEmployee[],
  search: string,
  department: EmployeeDepartment | 'all',
) {
  const normalizedSearch = search.trim().toLocaleLowerCase()

  return employees.filter((employee) => {
    const matchesDepartment = department === 'all' || employee.department === department
    const searchableValues = [employee.name, employee.email, employee.designation, employee.department].join(' ').toLocaleLowerCase()

    return matchesDepartment && (!normalizedSearch || searchableValues.includes(normalizedSearch))
  })
}

export function groupEmployeesByDepartment(employees: readonly DirectoryEmployee[]) {
  return employees.reduce<Partial<Record<EmployeeDepartment, DirectoryEmployee[]>>>((groups, employee) => {
    const group = groups[employee.department] ?? []
    group.push(employee)
    groups[employee.department] = group
    return groups
  }, {})
}

export function toEmployeeCsv(employees: readonly DirectoryEmployee[]) {
  const rows = [
    ['Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Join date', 'Status', 'Phone'],
    ...employees.map((employee) => [
      employee.id,
      employee.name,
      employee.email,
      employee.department,
      employee.designation,
      employee.joinDate,
      employee.status,
      employee.phone,
    ]),
  ]

  return rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')
}
