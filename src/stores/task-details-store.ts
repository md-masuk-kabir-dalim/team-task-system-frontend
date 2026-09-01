import { create } from 'zustand'
import type { Task, TaskPriority } from '../features/tasks/types/task-types.ts'

export type TaskDetailsTab = 'activity' | 'comments' | 'subtasks'

export interface TaskDetailsEditValues {
  assigneeId: string
  description: string
  dueDate: string
  priority: TaskPriority
  title: string
}

interface TaskDetailSubtask {
  completed: boolean
  id: string
  label: string
}

interface TaskActivity {
  id: string
  label: string
}

export interface TaskDetailsViewState {
  actionError: string | null
  activeTab: TaskDetailsTab
  activity: readonly TaskActivity[]
  comment: string
  comments: readonly string[]
  editError: string | null
  editValues: TaskDetailsEditValues
  feedback: string | null
  isActionMenuOpen: boolean
  isEditDialogOpen: boolean
  isMarkingComplete: boolean
  isSavingEdit: boolean
  isUpdatingStatus: boolean
  subtasks: readonly TaskDetailSubtask[]
}

interface TaskDetailsStore {
  addActivity: (taskId: string, label: string) => void
  addSubtask: (taskId: string) => void
  byTaskId: Readonly<Record<string, TaskDetailsViewState>>
  closeActionMenu: (taskId: string) => void
  closeEdit: (taskId: string) => void
  ensureTask: (task: Task) => void
  openEdit: (task: Task) => void
  postComment: (taskId: string) => boolean
  setActionError: (taskId: string, error: string | null) => void
  setActiveTab: (taskId: string, tab: TaskDetailsTab) => void
  setComment: (taskId: string, comment: string) => void
  setEditError: (taskId: string, error: string | null) => void
  setEditValues: (taskId: string, values: Partial<TaskDetailsEditValues>) => void
  setFeedback: (taskId: string, feedback: string | null) => void
  setMarkingComplete: (taskId: string, isMarkingComplete: boolean) => void
  setSavingEdit: (taskId: string, isSavingEdit: boolean) => void
  setUpdatingStatus: (taskId: string, isUpdatingStatus: boolean) => void
  toggleActionMenu: (taskId: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
}

const initialSubtasks: readonly TaskDetailSubtask[] = [
  { completed: true, id: 'define-categories', label: 'Define task categories' },
  { completed: true, id: 'collect-inputs', label: 'Collect stakeholder inputs' },
  { completed: true, id: 'build-plan', label: 'Build the implementation plan' },
  { completed: false, id: 'review-work', label: 'Review with the project team' },
  { completed: false, id: 'publish-summary', label: 'Publish the delivery summary' },
]

const emptyEditValues: TaskDetailsEditValues = {
  assigneeId: 'unassigned',
  description: '',
  dueDate: '',
  priority: 'medium',
  title: '',
}

export const emptyTaskDetailsViewState: TaskDetailsViewState = {
  actionError: null,
  activeTab: 'subtasks',
  activity: [],
  comment: '',
  comments: [],
  editError: null,
  editValues: emptyEditValues,
  feedback: null,
  isActionMenuOpen: false,
  isEditDialogOpen: false,
  isMarkingComplete: false,
  isSavingEdit: false,
  isUpdatingStatus: false,
  subtasks: initialSubtasks,
}

function formatCreatedAt(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(timestamp))
}

function getEditValues(task: Task): TaskDetailsEditValues {
  return {
    assigneeId: task.assigneeId ?? 'unassigned',
    description: task.description ?? '',
    dueDate: task.dueDate ?? '',
    priority: task.priority,
    title: task.title,
  }
}

function createTaskDetailsViewState(task: Task): TaskDetailsViewState {
  return {
    ...emptyTaskDetailsViewState,
    activity: [{ id: 'created', label: `Created ${formatCreatedAt(task.createdAt)}` }],
    editValues: getEditValues(task),
    subtasks: initialSubtasks.map((subtask) => ({ ...subtask })),
  }
}

function addActivity(activity: readonly TaskActivity[], label: string) {
  return [{ id: `${Date.now()}-${activity.length}`, label }, ...activity]
}

function updateTaskDetails(
  set: (partial: Partial<TaskDetailsStore> | ((state: TaskDetailsStore) => Partial<TaskDetailsStore>)) => void,
  taskId: string,
  update: (current: TaskDetailsViewState) => TaskDetailsViewState,
) {
  set((state) => ({
    byTaskId: {
      ...state.byTaskId,
      [taskId]: update(state.byTaskId[taskId] ?? emptyTaskDetailsViewState),
    },
  }))
}

export const useTaskDetailsStore = create<TaskDetailsStore>((set, get) => ({
  addActivity: (taskId, label) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, activity: addActivity(current.activity, label) }))
  },
  addSubtask: (taskId) => {
    updateTaskDetails(set, taskId, (current) => {
      const subtask = { completed: false, id: `follow-up-${current.subtasks.length + 1}`, label: 'New follow-up task' }

      return {
        ...current,
        activity: addActivity(current.activity, 'Added a follow-up task'),
        feedback: 'A new follow-up task was added to the checklist.',
        subtasks: [...current.subtasks, subtask],
      }
    })
  },
  byTaskId: {},
  closeActionMenu: (taskId) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, isActionMenuOpen: false }))
  },
  closeEdit: (taskId) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, isEditDialogOpen: false }))
  },
  ensureTask: (task) => {
    if (get().byTaskId[task.id]) {
      return
    }

    set((state) => ({ byTaskId: { ...state.byTaskId, [task.id]: createTaskDetailsViewState(task) } }))
  },
  openEdit: (task) => {
    updateTaskDetails(set, task.id, (current) => ({
      ...current,
      editError: null,
      editValues: getEditValues(task),
      isEditDialogOpen: true,
    }))
  },
  postComment: (taskId) => {
    const comment = get().byTaskId[taskId]?.comment.trim() ?? ''

    if (!comment) {
      return false
    }

    updateTaskDetails(set, taskId, (current) => ({
      ...current,
      activity: addActivity(current.activity, 'Added a comment'),
      comment: '',
      comments: [comment, ...current.comments],
      feedback: 'Comment added.',
    }))
    return true
  },
  setActionError: (taskId, actionError) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, actionError }))
  },
  setActiveTab: (taskId, activeTab) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, activeTab }))
  },
  setComment: (taskId, comment) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, comment }))
  },
  setEditError: (taskId, editError) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, editError }))
  },
  setEditValues: (taskId, editValues) => {
    updateTaskDetails(set, taskId, (current) => ({
      ...current,
      editValues: { ...current.editValues, ...editValues },
    }))
  },
  setFeedback: (taskId, feedback) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, feedback }))
  },
  setMarkingComplete: (taskId, isMarkingComplete) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, isMarkingComplete }))
  },
  setSavingEdit: (taskId, isSavingEdit) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, isSavingEdit }))
  },
  setUpdatingStatus: (taskId, isUpdatingStatus) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, isUpdatingStatus }))
  },
  toggleActionMenu: (taskId) => {
    updateTaskDetails(set, taskId, (current) => ({ ...current, isActionMenuOpen: !current.isActionMenuOpen }))
  },
  toggleSubtask: (taskId, subtaskId) => {
    updateTaskDetails(set, taskId, (current) => {
      const changedSubtask = current.subtasks.find((subtask) => subtask.id === subtaskId)

      if (!changedSubtask) {
        return current
      }

      return {
        ...current,
        activity: addActivity(current.activity, `${changedSubtask.completed ? 'Reopened' : 'Completed'} “${changedSubtask.label}”`),
        subtasks: current.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask),
      }
    })
  },
}))
