import { ListTodo, UsersRound } from 'lucide-react'
import type { NavigationItem, PageContext } from '../types/navigation-types.ts'

export const appRoutes = {
  root: '/',
  tasks: '/tasks',
  team: '/team',
} as const

export const primaryNavigation: readonly NavigationItem[] = [
  { icon: ListTodo, label: 'Tasks', to: appRoutes.tasks },
  { icon: UsersRound, label: 'Team', to: appRoutes.team },
]

const pageContexts: Record<string, PageContext> = {
  [appRoutes.tasks]: { eyebrow: 'Workspace', title: 'Tasks' },
  [appRoutes.team]: { eyebrow: 'Workspace', title: 'Team' },
}

export function getPageContext(pathname: string): PageContext {
  return pageContexts[pathname] ?? { eyebrow: 'Workspace', title: 'Page not found' }
}
