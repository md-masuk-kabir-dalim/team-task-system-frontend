import { describe, expect, it } from 'vitest'
import {
  createTask,
  defaultTaskListQuery,
  getTaskById,
  listTasks,
  moveTask,
  TaskServiceError,
  updateTaskStatus,
} from './task-service.ts'

describe('task service', () => {
  it('filters, searches, sorts, and paginates task results', async () => {
    const blockedTasks = await listTasks({
      ...defaultTaskListQuery,
      filters: { ...defaultTaskListQuery.filters, status: 'blocked' },
      page: 2,
      sort: { direction: 'desc', field: 'priority' },
    }, { delayMs: 0 })

    expect(blockedTasks.items).toHaveLength(20)
    expect(blockedTasks.pagination.page).toBe(2)
    expect(blockedTasks.pagination.totalItems).toBeGreaterThan(20)
    expect(blockedTasks.items.every((task) => task.status === 'blocked')).toBe(true)

    const assigneeSearch = await listTasks({
      ...defaultTaskListQuery,
      search: 'alexandria constantinople-montgomery',
    }, { delayMs: 0 })

    expect(assigneeSearch.items.length).toBeGreaterThan(0)
  })

  it('returns a recoverable error when a request is configured to fail', async () => {
    await expect(listTasks(defaultTaskListQuery, { delayMs: 0, forceError: true }))
      .rejects.toBeInstanceOf(TaskServiceError)
  })

  it('persists a Jira-style insertion position and shifts the remaining cards', async () => {
    const movedTask = await moveTask({
      destination: { taskId: 'task-001', type: 'before' },
      id: 'task-003',
      status: 'todo',
    }, { delayMs: 0 })
    const formerFirstTask = await getTaskById('task-001', { delayMs: 0 })

    expect(movedTask).toMatchObject({ id: 'task-003', position: 0, status: 'todo' })
    expect(formerFirstTask?.position).toBe(1)

    const movedAcrossColumns = await moveTask({
      destination: { taskId: 'task-004', type: 'before' },
      id: 'task-003',
      status: 'done',
    }, { delayMs: 0 })

    expect(movedAcrossColumns).toMatchObject({ id: 'task-003', position: 0, status: 'done' })
  })

  it('persists created tasks and workflow updates in the mock service', async () => {
    const initialResult = await listTasks(defaultTaskListQuery, { delayMs: 0 })
    const createdTask = await createTask({
      assigneeId: null,
      description: 'Created as part of a service behavior check.',
      dueDate: null,
      priority: 'high',
      status: 'todo',
      title: 'Verify the mock workflow update',
    }, { delayMs: 0 })

    const updatedTask = await updateTaskStatus(createdTask.id, 'done', { delayMs: 0 })
    const fetchedTask = await getTaskById(createdTask.id, { delayMs: 0 })
    const finalResult = await listTasks(defaultTaskListQuery, { delayMs: 0 })

    expect(updatedTask.status).toBe('done')
    expect(fetchedTask).toMatchObject({ id: createdTask.id, status: 'done' })
    expect(finalResult.pagination.totalItems).toBe(initialResult.pagination.totalItems + 1)
  })
})
