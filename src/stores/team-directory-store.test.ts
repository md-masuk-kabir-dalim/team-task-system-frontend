import { beforeEach, describe, expect, it } from 'vitest'
import { teamDirectoryFixtures } from '../features/team/data/team-directory-fixtures.ts'
import { defaultEmployeeDraft } from '../features/team/types/team-directory-types.ts'
import { useTeamDirectoryStore } from './team-directory-store.ts'

describe('team directory store', () => {
  beforeEach(() => {
    useTeamDirectoryStore.setState({
      createDraft: defaultEmployeeDraft,
      department: 'all',
      employees: teamDirectoryFixtures,
      isCreateFormOpen: false,
      page: 1,
      search: '',
      selectedEmployeeId: null,
      selectedEmployeeIds: [],
      view: 'board',
    })
  })

  it('keeps directory views, filters, selection, and employee creation in Zustand', () => {
    const store = useTeamDirectoryStore.getState()

    store.setView('list')
    store.setDepartment('Development')
    store.setSearch('Jamie')
    store.toggleEmployeeSelection('EMP-002')
    store.openCreateForm('Marketing')
    store.updateCreateDraft({
      designation: 'Brand Designer',
      email: 'new.employee@webns.example',
      name: 'New Employee',
      phone: '+1 555 0120',
    })
    store.createEmployee()

    const state = useTeamDirectoryStore.getState()
    const createdEmployee = state.employees.at(-1)

    expect(state.view).toBe('list')
    expect(state.department).toBe('Development')
    expect(state.search).toBe('Jamie')
    expect(state.selectedEmployeeIds).toEqual(['EMP-002'])
    expect(createdEmployee).toMatchObject({ department: 'Marketing', id: 'EMP-013', name: 'New Employee' })
    expect(state.selectedEmployeeId).toBe('EMP-013')
    expect(state.isCreateFormOpen).toBe(false)
  })
})
