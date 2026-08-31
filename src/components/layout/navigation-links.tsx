import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/cn.ts'
import { primaryNavigation } from '../../lib/navigation.ts'

interface NavigationLinksProps {
  onNavigate?: () => void
}

export function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <nav aria-label="Primary navigation" className="navigation-links">
      {primaryNavigation.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            className={({ isActive }) => cn('navigation-link', isActive && 'navigation-link--active')}
            key={item.to}
            onClick={onNavigate}
            to={item.to}
          >
            <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
