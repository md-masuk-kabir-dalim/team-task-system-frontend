import { beforeEach, describe, expect, it } from 'vitest'
import { taskFixtures } from '../features/tasks/data/task-fixtures.ts'
import { useTaskDetailsStore } from './task-details-store.ts'

describe('task details store', () => {
  beforeEach(() => {
    useTaskDetailsStore.setState({ byTaskId: {} })
  })

  it('keeps task-detail tabs, comments, checklist, and edit state in Zustand', () => {
    const task = taskFixtures[0]

    if (!task) {
      throw new Error('Expected task fixtures to include at least one task.')
    }

    useTaskDetailsStore.getState().ensureTask(task)
    useTaskDetailsStore.getState().setActiveTab(task.id, 'comments')
    useTaskDetailsStore.getState().setComment(task.id, 'Centralized comment')

    expect(useTaskDetailsStore.getState().postComment(task.id)).toBe(true)

    useTaskDetailsStore.getState().toggleSubtask(task.id, 'review-work')
    useTaskDetailsStore.getState().addSubtask(task.id)
    useTaskDetailsStore.getState().openEdit(task)
    useTaskDetailsStore.getState().setEditValues(task.id, { title: 'Updated from Zustand' })

    const state = useTaskDetailsStore.getState().byTaskId[task.id]

    if (!state) {
      throw new Error('Expected the task details state to be initialized.')
    }

    expect(state.activeTab).toBe('comments')
    expect(state.comments).toEqual(['Centralized comment'])
    expect(state.subtasks.find((subtask) => subtask.id === 'review-work')?.completed).toBe(true)
    expect(state.subtasks).toHaveLength(6)
    expect(state.editValues.title).toBe('Updated from Zustand')
    expect(state.isEditDialogOpen).toBe(true)
  })
})
