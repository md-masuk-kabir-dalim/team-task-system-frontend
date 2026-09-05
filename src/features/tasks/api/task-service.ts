import { taskFixtures } from '../data/task-fixtures.ts'
import { currentTeamMemberId, teamMembers } from '../data/team-members.ts'
import type {
  DueDateFilter,
  PaginationMetadata,
  TaskFilters,
  TaskListQuery,
  TaskSort,
  TaskSortField,
  TaskSummary,
} from '../types/task-query-types.ts'
import type { Task, TaskPriority, TeamMember } from '../types/task-types.ts'
import { getTodayDateKey, isTaskOverdue } from '../utils/task-date-utils.ts'

const DEFAULT_DELAY_MS = 320
const DEFAULT_PAGE_SIZE = 20

const priorityRank: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 4,
}

let taskRecords = taskFixtures.map(cloneTask)
let teamMemberRecords = teamMembers.map((member) => ({ ...member }))

export const defaultTaskFilters: TaskFilters = {
  assigneeId: 'all',
  dueDate: 'all',
  priority: 'all',
  status: 'all',
}

export const defaultTaskSort: TaskSort = {
  direction: 'asc',
  field: 'dueDate',
}

export const defaultTaskListQuery: TaskListQuery = {
  filters: defaultTaskFilters,
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: '',
  sort: defaultTaskSort,
  view: 'board',
}

export interface TaskServiceOptions {
  delayMs?: number
  forceError?: boolean
}

export interface TaskListResult {
  currentMemberId: string
  items: readonly Task[]
  members: readonly TeamMember[]
  pagination: PaginationMetadata
  summary: TaskSummary
}

export interface TaskDetailResult {
  currentMemberId: string
  members: readonly TeamMember[]
  task: Task
}

export interface CreateTaskInput {
  assigneeId: string | null
  description: string | null
  dueDate: string | null
  priority: TaskPriority
  status: Task['status']
  title: string
}

export interface UpdateTaskInput {
  assigneeId: string | null
  description: string | null
  dueDate: string | null
  priority: TaskPriority
  title: string
}

export interface MoveTaskInput {
  destination: TaskMoveDestination
  id: string
  status: Task['status']
}

export type TaskMoveDestination =
  | { taskId: string; type: 'after' | 'before' }
  | { type: 'end' }

export class TaskServiceError extends Error {
  constructor(message = 'Unable to load tasks. Please try again.') {
    super(message)
    this.name = 'TaskServiceError'
  }
}

function wait(duration: number) {
  return new Promise<void>((resolve) => globalThis.setTimeout(resolve, duration))
}

function cloneTask(task: Task): Task {
  return { ...task }
}

function getTasksInStatus(status: Task['status']) {
  return taskRecords
    .filter((task) => task.status === status)
    .toSorted((left, right) => left.position - right.position || left.id.localeCompare(right.id))
}

function getTeamMemberById(id: string) {
  return teamMemberRecords.find((member) => member.id === id)
}

export function registerTeamMember(member: TeamMember) {
  if (getTeamMemberById(member.id)) {
    throw new TaskServiceError('An employee with this identifier already exists.')
  }

  teamMemberRecords = [...teamMemberRecords, { ...member }]

  return { ...member }
}

function getNextPosition(status: Task['status']) {
  const lastTask = getTasksInStatus(status).at(-1)

  return (lastTask?.position ?? -1) + 1
}

function getDestinationIndex(tasks: readonly Task[], destination: TaskMoveDestination) {
  if (destination.type === 'end') {
    return tasks.length
  }

  const anchorIndex = tasks.findIndex((task) => task.id === destination.taskId)

  if (anchorIndex === -1) {
    throw new TaskServiceError('The target task could not be found.')
  }

  return destination.type === 'before' ? anchorIndex : anchorIndex + 1
}

function createTaskRecord(input: CreateTaskInput): Task {
  const timestamp = new Date().toISOString()

  return {
    ...input,
    createdAt: timestamp,
    id: `task-${String(taskRecords.length + 1).padStart(3, '0')}`,
    position: getNextPosition(input.status),
    updatedAt: timestamp,
  }
}

function normalizePage(page: number) {
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

function normalizePageSize(pageSize: number) {
  return Number.isFinite(pageSize) && pageSize > 0 ? Math.min(Math.floor(pageSize), 100) : DEFAULT_PAGE_SIZE
}

function matchesDueDateFilter(task: Task, dueDate: DueDateFilter, today: string) {
  switch (dueDate) {
    case 'no-date':
      return task.dueDate === null
    case 'overdue':
      return isTaskOverdue(task, today)
    case 'today':
      return task.dueDate === today
    case 'upcoming':
      return task.dueDate !== null && task.dueDate > today
    default:
      return true
  }
}

function matchesFilters(task: Task, filters: TaskFilters, today: string) {
  const matchesStatus = filters.status === 'all' || task.status === filters.status
  const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
  const matchesAssignee = filters.assigneeId === 'all'
    || (filters.assigneeId === 'unassigned' && task.assigneeId === null)
    || task.assigneeId === filters.assigneeId

  return matchesStatus && matchesPriority && matchesAssignee && matchesDueDateFilter(task, filters.dueDate, today)
}

function matchesSearch(task: Task, search: string) {
  if (!search) {
    return true
  }

  const normalizedSearch = search.trim().toLocaleLowerCase()

  if (!normalizedSearch) {
    return true
  }

  const assigneeName = task.assigneeId ? getTeamMemberById(task.assigneeId)?.name : undefined

  return task.title.toLocaleLowerCase().includes(normalizedSearch)
    || task.description?.toLocaleLowerCase().includes(normalizedSearch) === true
    || assigneeName?.toLocaleLowerCase().includes(normalizedSearch) === true
}

function compareNullableDates(left: string | null, right: string | null) {
  if (left === right) {
    return 0
  }

  if (left === null) {
    return 1
  }

  if (right === null) {
    return -1
  }

  return left.localeCompare(right)
}

function getTaskComparison(left: Task, right: Task, field: TaskSortField) {
  switch (field) {
    case 'dueDate':
      return compareNullableDates(left.dueDate, right.dueDate)
    case 'priority':
      return priorityRank[left.priority] - priorityRank[right.priority]
    case 'title':
      return left.title.localeCompare(right.title)
    case 'createdAt':
      return left.createdAt.localeCompare(right.createdAt)
    case 'updatedAt':
      return left.updatedAt.localeCompare(right.updatedAt)
  }
}

function sortTasks(tasks: readonly Task[], sort: TaskSort) {
  const directionMultiplier = sort.direction === 'asc' ? 1 : -1

  return tasks.toSorted((left, right) => {
    const comparison = getTaskComparison(left, right, sort.field)

    if (comparison !== 0) {
      return comparison * directionMultiplier
    }

    return left.id.localeCompare(right.id)
  })
}

function createSummary(tasks: readonly Task[], today: string): TaskSummary {
  return tasks.reduce<TaskSummary>((summary, task) => ({
    overdue: summary.overdue + Number(isTaskOverdue(task, today)),
    total: summary.total + 1,
    unassigned: summary.unassigned + Number(task.assigneeId === null),
    urgent: summary.urgent + Number(task.priority === 'urgent'),
  }), { overdue: 0, total: 0, unassigned: 0, urgent: 0 })
}

function createPagination(totalItems: number, page: number, pageSize: number): PaginationMetadata {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize))

  return {
    page: Math.min(page, pageCount),
    pageCount,
    pageSize,
    totalItems,
  }
}

async function resolveRequest<T>(value: T, options?: TaskServiceOptions): Promise<T> {
  await wait(options?.delayMs ?? DEFAULT_DELAY_MS)

  if (options?.forceError) {
    throw new TaskServiceError()
  }

  return value
}

export async function listTasks(
  query: TaskListQuery = defaultTaskListQuery,
  options?: TaskServiceOptions,
): Promise<TaskListResult> {
  const today = getTodayDateKey()
  const page = normalizePage(query.page)
  const pageSize = normalizePageSize(query.pageSize)
  const matchingTasks = taskRecords.filter(
    (task) => matchesFilters(task, query.filters, today) && matchesSearch(task, query.search),
  )
  const pagination = createPagination(matchingTasks.length, page, pageSize)
  const offset = (pagination.page - 1) * pagination.pageSize
  const items = sortTasks(matchingTasks, query.sort)
    .slice(offset, offset + pagination.pageSize)
    .map(cloneTask)

  return resolveRequest({
    currentMemberId: currentTeamMemberId,
    items,
    members: teamMemberRecords.map((member) => ({ ...member })),
    pagination,
    summary: createSummary(matchingTasks, today),
  }, options)
}

export async function getTaskById(id: string, options?: TaskServiceOptions): Promise<Task | null> {
  const task = taskRecords.find((record) => record.id === id)

  return resolveRequest(task ? cloneTask(task) : null, options)
}

export async function getTaskDetailById(id: string, options?: TaskServiceOptions): Promise<TaskDetailResult | null> {
  const task = taskRecords.find((record) => record.id === id)

  return resolveRequest(task ? {
    currentMemberId: currentTeamMemberId,
    members: teamMemberRecords.map((member) => ({ ...member })),
    task: cloneTask(task),
  } : null, options)
}

export async function createTask(input: CreateTaskInput, options?: TaskServiceOptions): Promise<Task> {
  if (input.assigneeId !== null && !getTeamMemberById(input.assigneeId)) {
    throw new TaskServiceError('The selected assignee is no longer available.')
  }

  await resolveRequest(undefined, options)

  const task = createTaskRecord(input)
  taskRecords = [task, ...taskRecords]

  return cloneTask(task)
}

export async function updateTaskStatus(
  id: string,
  status: Task['status'],
  options?: TaskServiceOptions,
): Promise<Task> {
  return moveTask({ destination: { type: 'end' }, id, status }, options)
}

export async function updateTask(
  id: string,
  input: UpdateTaskInput,
  options?: TaskServiceOptions,
): Promise<Task> {
  if (input.assigneeId !== null && !getTeamMemberById(input.assigneeId)) {
    throw new TaskServiceError('The selected assignee is no longer available.')
  }

  await resolveRequest(undefined, options)

  const currentTask = taskRecords.find((task) => task.id === id)

  if (!currentTask) {
    throw new TaskServiceError('This task could not be found.')
  }

  const updatedTask: Task = {
    ...currentTask,
    ...input,
    updatedAt: new Date().toISOString(),
  }

  taskRecords = taskRecords.map((task) => task.id === id ? updatedTask : task)

  return cloneTask(updatedTask)
}

export async function moveTask(
  { destination, id, status }: MoveTaskInput,
  options?: TaskServiceOptions,
): Promise<Task> {
  await resolveRequest(undefined, options)

  const currentTask = taskRecords.find((record) => record.id === id)

  if (!currentTask) {
    throw new TaskServiceError('This task could not be found.')
  }

  const updatedTask: Task = {
    ...currentTask,
    status,
    updatedAt: new Date().toISOString(),
  }
  const sourceTasks = getTasksInStatus(currentTask.status).filter((task) => task.id !== id)
  const targetTasks = currentTask.status === status ? sourceTasks : getTasksInStatus(status)
  const destinationIndex = getDestinationIndex(targetTasks, destination)
  const reorderedTargetTasks = [...targetTasks]
  reorderedTargetTasks.splice(destinationIndex, 0, updatedTask)
  const reorderedTasks = currentTask.status === status
    ? [reorderedTargetTasks]
    : [sourceTasks, reorderedTargetTasks]
  const orderedUpdates = new Map(
    reorderedTasks.flatMap((columnTasks) => columnTasks.map((task, position) => [
      task.id,
      { ...task, position },
    ] as const)),
  )
  const movedTask = orderedUpdates.get(id)

  if (!movedTask) {
    throw new TaskServiceError('This task could not be reordered.')
  }

  taskRecords = taskRecords.map((task) => orderedUpdates.get(task.id) ?? task)

  return cloneTask(movedTask)
}

export const taskService = {
  createTask,
  getTaskDetailById,
  getTaskById,
  listTasks,
  moveTask,
  updateTask,
  updateTaskStatus,
}
