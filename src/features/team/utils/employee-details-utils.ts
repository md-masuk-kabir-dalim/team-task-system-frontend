import type { DirectoryEmployee } from '../types/team-directory-types.ts'

interface DetailVariant {
  address: string
  dateOfBirth: string
  employmentType: string
  gender: string
  maritalStatus: string
  nationality: string
  reportingTo: string
  shift: string
  workLocation: string
}

export interface EmployeeDocument {
  description: string
  fileName: string
  type: 'profile' | 'work'
}

export interface EmployeeDetails {
  documents: readonly EmployeeDocument[]
  personal: Pick<DetailVariant, 'address' | 'dateOfBirth' | 'gender' | 'maritalStatus' | 'nationality'>
  work: Pick<DetailVariant, 'employmentType' | 'reportingTo' | 'shift' | 'workLocation'>
}

const detailVariants: readonly DetailVariant[] = [
  {
    address: 'Gulshan, Dhaka',
    dateOfBirth: 'Aug 24, 1994',
    employmentType: 'Full time',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Bangladeshi',
    reportingTo: 'Alex Morgan',
    shift: '9:00 AM – 6:00 PM',
    workLocation: 'Dhaka office',
  },
  {
    address: 'Dhanmondi, Dhaka',
    dateOfBirth: 'Feb 11, 1992',
    employmentType: 'Full time',
    gender: 'Female',
    maritalStatus: 'Married',
    nationality: 'Bangladeshi',
    reportingTo: 'Alex Morgan',
    shift: '10:00 AM – 7:00 PM',
    workLocation: 'Hybrid',
  },
  {
    address: 'Banani, Dhaka',
    dateOfBirth: 'Nov 06, 1991',
    employmentType: 'Full time',
    gender: 'Non-binary',
    maritalStatus: 'Prefer not to say',
    nationality: 'Bangladeshi',
    reportingTo: 'Alex Morgan',
    shift: '9:00 AM – 6:00 PM',
    workLocation: 'Remote',
  },
]

const documents: readonly EmployeeDocument[] = [
  { description: 'Employee profile summary', fileName: 'employee-profile.txt', type: 'profile' },
  { description: 'Current work assignment', fileName: 'work-assignment.txt', type: 'work' },
]

function getEmployeeIndex(employeeId: string) {
  const sequence = Number(employeeId.replace(/\D/g, ''))

  return Number.isFinite(sequence) && sequence > 0 ? sequence - 1 : 0
}

export function getEmployeeDetails(employee: DirectoryEmployee): EmployeeDetails {
  const variant = detailVariants[getEmployeeIndex(employee.id) % detailVariants.length]

  if (!variant) {
    throw new Error('Employee detail variants are unavailable.')
  }

  return {
    documents,
    personal: {
      address: variant.address,
      dateOfBirth: variant.dateOfBirth,
      gender: variant.gender,
      maritalStatus: variant.maritalStatus,
      nationality: variant.nationality,
    },
    work: {
      employmentType: variant.employmentType,
      reportingTo: employee.name === 'Alex Morgan' ? '—' : variant.reportingTo,
      shift: variant.shift,
      workLocation: variant.workLocation,
    },
  }
}

export function createEmployeeDocumentContent(employee: DirectoryEmployee, document: EmployeeDocument) {
  return [
    document.description,
    '',
    `Employee: ${employee.name}`,
    `Employee ID: ${employee.id}`,
    `Department: ${employee.department}`,
    `Designation: ${employee.designation}`,
    `Email: ${employee.email}`,
    `Phone: ${employee.phone}`,
  ].join('\n')
}
