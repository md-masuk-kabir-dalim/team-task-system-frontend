import { teamMembers } from './team-members.ts'
import type { Task, TaskPriority, TaskStatus } from '../types/task-types.ts'

const DAY_IN_MILLISECONDS = 86_400_000
const TASK_COUNT = 360

const statusCycle: readonly TaskStatus[] = ['todo', 'in-progress', 'todo', 'done', 'in-progress', 'blocked', 'todo', 'done']
const priorityCycle: readonly TaskPriority[] = ['medium', 'low', 'medium', 'high', 'medium', 'urgent', 'low', 'high']

const workstreams = [
  'Account settings',
  'Billing portal',
  'Campaign reporting',
  'Customer import',
  'Design system',
  'Mobile workspace',
  'Notification center',
  'Onboarding flow',
  'Project templates',
  'Security review',
  'Team permissions',
  'Workspace analytics',
] as const

const taskVerbs = [
  'Audit',
  'Clarify',
  'Design',
  'Document',
  'Investigate',
  'Prepare',
  'Refine',
  'Review',
  'Ship',
  'Validate',
] as const

const longTaskTitles = [
  'Make the keyboard navigation behavior for the account-switching workflow understandable when a workspace contains several hundred projects with similarly named owners',
  'Resolve the inconsistent empty state that appears after a user changes both a saved filter and the current workspace while a request is still in flight',
  'Confirm that retention settings are explained clearly enough for administrators who have not previously worked with audit-log export policies',
] as const

const conciseTaskTitles = ['Fix copy', 'QA', 'Sync', 'Triage', 'Follow up'] as const

const descriptionStarters = [
  'Coordinate with design and support before this moves to review.',
  'Capture the decision and any follow-up work in the release notes.',
  'Check the existing implementation for edge cases before changing the workflow.',
  'Use the latest customer feedback to confirm the proposed direction.',
] as const

function createSeededRandom(seed: number) {
  let state = seed

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0
    return state / 4_294_967_296
  }
}

function getRequiredItem<T>(items: readonly T[], index: number): T {
  const item = items[index]

  if (item === undefined) {
    throw new Error(`Fixture item at index ${index} was not found.`)
  }

  return item
}

function createDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

function dateFromToday(daysFromToday: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + daysFromToday)
  return date
}

function getDueDate(index: number, random: () => number) {
  if (index % 13 === 0) {
    return null
  }

  if (index % 17 === 0) {
    return createDateKey(dateFromToday(0))
  }

  if (index % 9 === 0) {
    return createDateKey(dateFromToday(-1 - Math.floor(random() * 18)))
  }

  return createDateKey(dateFromToday(Math.floor(random() * 120) - 24))
}

function getDescription(index: number, random: () => number) {
  if (index % 11 === 0) {
    return null
  }

  const baseDescription = getRequiredItem(descriptionStarters, index % descriptionStarters.length)

  if (index % 19 !== 0) {
    return baseDescription
  }

  const workstream = getRequiredItem(workstreams, Math.floor(random() * workstreams.length))
  return `${baseDescription} This item needs a documented handoff across the ${workstream.toLowerCase()} workstream, including the assumptions made, the decision owner, and the criteria that will show the change is ready to release.`
}

function getTitle(index: number, random: () => number) {
  if (index % 47 === 0) {
    return getRequiredItem(conciseTaskTitles, index % conciseTaskTitles.length)
  }

  if (index % 53 === 0) {
    return getRequiredItem(longTaskTitles, index % longTaskTitles.length)
  }

  const verb = getRequiredItem(taskVerbs, index % taskVerbs.length)
  const workstream = getRequiredItem(workstreams, Math.floor(random() * workstreams.length))
  const detail = getRequiredItem(
    ['for the next release', 'with customer feedback', 'before the weekly review', 'for mobile users'],
    index % 4,
  )

  return `${verb} ${workstream.toLowerCase()} ${detail}`
}

function createTask(index: number, random: () => number): Task {
  const createdAt = dateFromToday(-180 + Math.floor(random() * 170))
  const updatedAt = new Date(createdAt.getTime() + Math.floor(random() * 64) * DAY_IN_MILLISECONDS)
  const assignee = index % 8 === 0 ? null : getRequiredItem(teamMembers, Math.floor(random() * teamMembers.length))

  return {
    assigneeId: assignee?.id ?? null,
    createdAt: createdAt.toISOString(),
    description: getDescription(index, random),
    dueDate: getDueDate(index, random),
    id: `task-${String(index + 1).padStart(3, '0')}`,
    position: index,
    priority: getRequiredItem(priorityCycle, index % priorityCycle.length),
    status: getRequiredItem(statusCycle, index % statusCycle.length),
    title: getTitle(index, random),
    updatedAt: updatedAt.toISOString(),
  }
}

const random = createSeededRandom(20260901)

export const taskFixtures: readonly Task[] = Array.from(
  { length: TASK_COUNT },
  (_, index) => createTask(index, random),
)
