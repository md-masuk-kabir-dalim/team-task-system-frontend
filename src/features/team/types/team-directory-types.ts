export const employeeDepartments = ['Design', 'Development', 'Management', 'Marketing'] as const

export type EmployeeDepartment = (typeof employeeDepartments)[number]

export const employeeStatuses = ['active', 'on-leave', 'probation'] as const

export type EmployeeStatus = (typeof employeeStatuses)[number]

export type TeamDirectoryView = 'board' | 'list'

export interface DirectoryEmployee {
  avatarUrl?: string
  department: EmployeeDepartment
  designation: string
  email: string
  id: string
  joinDate: string
  name: string
  phone: string
  status: EmployeeStatus
  taskMemberId: string
}

export interface EmployeeDraft {
  department: EmployeeDepartment
  designation: string
  email: string
  name: string
  phone: string
  status: EmployeeStatus
}

export type EmployeeProfileUpdate = Pick<DirectoryEmployee, 'department' | 'designation' | 'phone' | 'status'>

export const defaultEmployeeDraft: EmployeeDraft = {
  department: 'Design',
  designation: '',
  email: '',
  name: '',
  phone: '',
  status: 'active',
}
