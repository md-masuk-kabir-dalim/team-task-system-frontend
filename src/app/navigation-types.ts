import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  icon: LucideIcon
  label: string
  to: string
}

export interface PageContext {
  eyebrow: string
  title: string
}
