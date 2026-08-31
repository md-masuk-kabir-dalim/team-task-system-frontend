import { LayoutDashboard, ListTodo, Settings, UsersRound } from 'lucide-react'
import type { NavigationItem } from '../types/navigation-types.ts'

export const primaryNavigation: NavigationItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
  { icon: ListTodo, label: 'Tasks', to: '/tasks' },
  { icon: UsersRound, label: 'Team', to: '/team' },
  { icon: Settings, label: 'Settings', to: '/settings' },
]

export function getPageTitle(pathname: string) {
  const navigationItem = primaryNavigation.find((item) => item.to === pathname)

  if (navigationItem) {
    return navigationItem.label
  }

  if (pathname.startsWith('/tasks/')) {
    return 'Task details'
  }

  return 'Team tasks'
}
