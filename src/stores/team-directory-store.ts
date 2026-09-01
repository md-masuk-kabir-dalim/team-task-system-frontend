import { create } from 'zustand'
import { teamDirectoryFixtures } from '../features/team/data/team-directory-fixtures.ts'
import {
  defaultEmployeeDraft,
  type DirectoryEmployee,
  type EmployeeDepartment,
  type EmployeeDraft,
  type TeamDirectoryView,
} from '../features/team/types/team-directory-types.ts'

interface TeamDirectoryStore {
  createDraft: EmployeeDraft
  department: EmployeeDepartment | 'all'
  employees: readonly DirectoryEmployee[]
  isCreateFormOpen: boolean
  page: number
  search: string
  selectedEmployeeId: string | null
  selectedEmployeeIds: readonly string[]
  view: TeamDirectoryView
  closeCreateForm: () => void
  createEmployee: () => void
  openCreateForm: (department?: EmployeeDepartment) => void
  setDepartment: (department: EmployeeDepartment | 'all') => void
  setPage: (page: number) => void
  setSearch: (search: string) => void
  setSelectedEmployee: (employeeId: string | null) => void
  setView: (view: TeamDirectoryView) => void
  toggleEmployeeSelection: (employeeId: string) => void
  toggleVisibleSelection: (employeeIds: readonly string[]) => void
  updateCreateDraft: (values: Partial<EmployeeDraft>) => void
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
    const employee: DirectoryEmployee = {
      ...createDraft,
      id: getNewEmployeeId(employees),
      joinDate: new Date().toISOString().slice(0, 10),
    }

    set({
      createDraft: defaultEmployeeDraft,
      employees: [...employees, employee],
      isCreateFormOpen: false,
      selectedEmployeeId: employee.id,
    })
  },
  department: 'all',
  employees: teamDirectoryFixtures,
  isCreateFormOpen: false,
  openCreateForm: (department) => set({
    createDraft: { ...defaultEmployeeDraft, department: department ?? defaultEmployeeDraft.department },
    isCreateFormOpen: true,
  }),
  page: 1,
  search: '',
  selectedEmployeeId: null,
  selectedEmployeeIds: [],
  setDepartment: (department) => set({ department, page: 1 }),
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ page: 1, search }),
  setSelectedEmployee: (selectedEmployeeId) => set({ selectedEmployeeId }),
  setView: (view) => set({ view }),
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
  view: 'board',
}))
