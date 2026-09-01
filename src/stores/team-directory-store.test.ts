import { beforeEach, describe, expect, it } from 'vitest'
import { teamDirectoryFixtures } from '../features/team/data/team-directory-fixtures.ts'
import { defaultEmployeeDraft } from '../features/team/types/team-directory-types.ts'
import { listTasks } from '../features/tasks/api/task-service.ts'
import { useTeamDirectoryStore } from './team-directory-store.ts'

describe('team directory store', () => {
  beforeEach(() => {
    useTeamDirectoryStore.setState({
      createDraft: defaultEmployeeDraft,
      employees: teamDirectoryFixtures,
      isCreateFormOpen: false,
      selectedEmployeeId: null,
      selectedEmployeeIds: [],
    })
  })

  it('keeps directory selection in Zustand and makes new employees available as task assignees', async () => {
    const store = useTeamDirectoryStore.getState()

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
    const taskList = await listTasks(undefined, { delayMs: 0 })

    expect(state.selectedEmployeeIds).toEqual(['EMP-002'])
    expect(createdEmployee).toMatchObject({ department: 'Marketing', id: 'EMP-013', name: 'New Employee', taskMemberId: 'EMP-013' })
    expect(taskList.members).toContainEqual({ email: 'new.employee@webns.example', id: 'EMP-013', name: 'New Employee' })
    expect(state.selectedEmployeeId).toBe('EMP-013')
    expect(state.isCreateFormOpen).toBe(false)
  })
})
