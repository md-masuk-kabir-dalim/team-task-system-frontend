import { NavLink } from 'react-router-dom'
import { cn } from '@/shared/lib/cn.ts'
import { primaryNavigation } from '@/app/navigation.ts'

interface NavigationLinksProps {
  className?: string
  onNavigate?: () => void
}

export function NavigationLinks({ className, onNavigate }: NavigationLinksProps) {
  return (
    <nav aria-label="Primary navigation" className={cn('navigation-links', className)}>
      {primaryNavigation.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            aria-label={item.label}
            className={({ isActive }) => cn('navigation-link', isActive && 'navigation-link--active')}
            key={item.to}
            onClick={onNavigate}
            to={item.to}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            <span className="navigation-link__label">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
