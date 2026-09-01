import { create } from 'zustand'
import { teamDirectoryFixtures } from '../features/team/data/team-directory-fixtures.ts'
import { registerTeamMember } from '../features/tasks/api/task-service.ts'
import {
  defaultEmployeeDraft,
  type DirectoryEmployee,
  type EmployeeDepartment,
  type EmployeeDraft,
  type EmployeeProfileUpdate,
} from '../features/team/types/team-directory-types.ts'

interface TeamDirectoryStore {
  createDraft: EmployeeDraft
  employees: readonly DirectoryEmployee[]
  isCreateFormOpen: boolean
  selectedEmployeeIds: readonly string[]
  closeCreateForm: () => void
  createEmployee: () => void
  openCreateForm: (department?: EmployeeDepartment) => void
  toggleEmployeeSelection: (employeeId: string) => void
  toggleVisibleSelection: (employeeIds: readonly string[]) => void
  updateCreateDraft: (values: Partial<EmployeeDraft>) => void
  updateEmployee: (employeeId: string, values: Partial<EmployeeProfileUpdate>) => void
}

function getNewEmployeeId(employees: readonly DirectoryEmployee[]) {
  const nextSequence = employees.length + 1
  return `EMP-${String(nextSequence).padStart(3, '0')}`
}

export const useTeamDirectoryStore = create<TeamDirectoryStore>((set, get) => ({
  closeCreateForm: () => set({ createDraft: defaultEmployeeDraft, isCreateFormOpen: false }),
  createDraft: defaultEmployeeDraft,
  createEmployee: () => {
    const { createDraft, employees } = get()
    const employeeId = getNewEmployeeId(employees)
    const employee: DirectoryEmployee = {
      ...createDraft,
      id: employeeId,
      joinDate: new Date().toISOString().slice(0, 10),
      taskMemberId: employeeId,
    }

    registerTeamMember({ email: employee.email, id: employee.taskMemberId, name: employee.name })

    set({
      createDraft: defaultEmployeeDraft,
      employees: [...employees, employee],
      isCreateFormOpen: false,
    })
  },
  employees: teamDirectoryFixtures,
  isCreateFormOpen: false,
  openCreateForm: (department) => set({
    createDraft: { ...defaultEmployeeDraft, department: department ?? defaultEmployeeDraft.department },
    isCreateFormOpen: true,
  }),
  selectedEmployeeIds: [],
  toggleEmployeeSelection: (employeeId) => set((state) => ({
    selectedEmployeeIds: state.selectedEmployeeIds.includes(employeeId)
      ? state.selectedEmployeeIds.filter((id) => id !== employeeId)
      : [...state.selectedEmployeeIds, employeeId],
  })),
  toggleVisibleSelection: (employeeIds) => set((state) => {
    const areAllSelected = employeeIds.length > 0 && employeeIds.every((id) => state.selectedEmployeeIds.includes(id))
    const selectedEmployeeIds = areAllSelected
      ? state.selectedEmployeeIds.filter((id) => !employeeIds.includes(id))
      : [...new Set([...state.selectedEmployeeIds, ...employeeIds])]

    return { selectedEmployeeIds }
  }),
  updateCreateDraft: (values) => set((state) => ({ createDraft: { ...state.createDraft, ...values } })),
  updateEmployee: (employeeId, values) => set((state) => ({
    employees: state.employees.map((employee) => employee.id === employeeId ? { ...employee, ...values } : employee),
  })),
}))
