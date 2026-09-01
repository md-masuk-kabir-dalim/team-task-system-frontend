import { CalendarDays, ListTodo, UsersRound } from 'lucide-react'
import type { NavigationItem, PageContext } from '../types/navigation-types.ts'

export const appRoutes = {
  root: '/',
  calendar: '/calendar',
  tasks: '/tasks',
  taskDetails: (taskId: string) => `/tasks/${taskId}`,
  team: '/team',
  teamDetails: (employeeId: string) => `/team/${employeeId}`,
} as const

export const primaryNavigation: readonly NavigationItem[] = [
  { icon: ListTodo, label: 'Tasks', to: appRoutes.tasks },
  { icon: CalendarDays, label: 'Calendar', to: appRoutes.calendar },
  { icon: UsersRound, label: 'Team', to: appRoutes.team },
]

const pageContexts: Record<string, PageContext> = {
  [appRoutes.tasks]: { eyebrow: 'Workspace', title: 'Tasks' },
  [appRoutes.calendar]: { eyebrow: 'Workspace', title: 'Calendar' },
  [appRoutes.team]: { eyebrow: 'Workspace', title: 'Team' },
}

export function getPageContext(pathname: string): PageContext {
  if (pathname.startsWith(`${appRoutes.tasks}/`)) {
    return { eyebrow: 'Work queue', title: 'Task details' }
  }

  if (pathname.startsWith(`${appRoutes.team}/`)) {
    return { eyebrow: 'People', title: 'Employee details' }
  }

  return pageContexts[pathname] ?? { eyebrow: 'Workspace', title: 'Page not found' }
}
