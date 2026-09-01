import { create } from 'zustand'
import {
  createTask as createTaskRequest,
  getTaskDetailById,
  listTasks,
  moveTask as moveTaskRequest,
  updateTask as updateTaskRequest,
  updateTaskStatus as updateTaskStatusRequest,
  type CreateTaskInput,
  type MoveTaskInput,
  type TaskDetailResult,
  type TaskListResult,
  type UpdateTaskInput,
} from '../features/tasks/api/task-service.ts'
import type { TaskListQuery } from '../features/tasks/types/task-query-types.ts'
import type { Task, TaskStatus } from '../features/tasks/types/task-types.ts'
import { asStoreError, type AsyncStatus } from './store-types.ts'
import { useTeamWorkspaceStore } from './team-workspace-store.ts'

interface TaskStore {
  createTask: (input: CreateTaskInput) => Promise<Task>
  detail: TaskDetailResult | null
  detailError: Error | null
  detailStatus: AsyncStatus
  list: TaskListResult | null
  listError: Error | null
  listQuery: TaskListQuery | null
  listStatus: AsyncStatus
  loadDetail: (taskId: string | undefined) => Promise<void>
  loadList: (query: TaskListQuery) => Promise<void>
  moveTask: (input: MoveTaskInput) => Promise<Task>
  refreshList: () => Promise<void>
  updateTask: (taskId: string, input: UpdateTaskInput) => Promise<Task>
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<Task>
}

let detailRequestId = 0
let listRequestId = 0

function applyTaskUpdate(state: Pick<TaskStore, 'detail' | 'list'>, task: Task) {
  return {
    detail: state.detail?.task.id === task.id ? { ...state.detail, task } : state.detail,
    list: state.list
      ? { ...state.list, items: state.list.items.map((currentTask) => currentTask.id === task.id ? task : currentTask) }
      : state.list,
  }
}

function refreshRelatedWorkspaceData() {
  void useTeamWorkspaceStore.getState().refresh()
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  createTask: async (input) => {
    const task = await createTaskRequest(input)
    await get().refreshList()
    refreshRelatedWorkspaceData()
    return task
  },
  detail: null,
  detailError: null,
  detailStatus: 'idle',
  list: null,
  listError: null,
  listQuery: null,
  listStatus: 'idle',
  loadDetail: async (taskId) => {
    const currentRequestId = ++detailRequestId

    if (!taskId) {
      set({ detail: null, detailError: null, detailStatus: 'success' })
      return
    }

    set({ detailError: null, detailStatus: 'loading' })

    try {
      const detail = await getTaskDetailById(taskId)

      if (currentRequestId === detailRequestId) {
        set({ detail, detailError: null, detailStatus: 'success' })
      }
    } catch (error: unknown) {
      if (currentRequestId === detailRequestId) {
        set({ detailError: asStoreError(error, 'Unable to load task details.'), detailStatus: 'error' })
      }
    }
  },
  loadList: async (query) => {
    const currentRequestId = ++listRequestId
    set({ listError: null, listQuery: query, listStatus: 'loading' })

    try {
      const list = await listTasks(query)

      if (currentRequestId === listRequestId) {
        set({ list, listError: null, listStatus: 'success' })
      }
    } catch (error: unknown) {
      if (currentRequestId === listRequestId) {
        set({ listError: asStoreError(error, 'Unable to load tasks.'), listStatus: 'error' })
      }
    }
  },
  moveTask: async (input) => {
    const task = await moveTaskRequest(input)
    set((state) => applyTaskUpdate(state, task))
    await get().refreshList()
    refreshRelatedWorkspaceData()
    return task
  },
  refreshList: async () => {
    const { listQuery } = get()

    if (listQuery) {
      await get().loadList(listQuery)
    }
  },
  updateTask: async (taskId, input) => {
    const task = await updateTaskRequest(taskId, input)
    set((state) => applyTaskUpdate(state, task))
    await get().refreshList()
    refreshRelatedWorkspaceData()
    return task
  },
  updateTaskStatus: async (taskId, status) => {
    const task = await updateTaskStatusRequest(taskId, status)
    set((state) => applyTaskUpdate(state, task))
    await get().refreshList()
    refreshRelatedWorkspaceData()
    return task
  },
}))
