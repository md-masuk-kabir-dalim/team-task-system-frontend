import { CheckSquare2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appRoutes } from '../../lib/navigation.ts'
import { Avatar } from '../ui/avatar.tsx'
import { NavigationLinks } from './navigation-links.tsx'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link aria-label="Pulseboard tasks" className="brand" to={appRoutes.tasks}>
        <span aria-hidden="true" className="brand__mark">
          <CheckSquare2 size={20} strokeWidth={2.4} />
        </span>
        <span className="brand__name">Pulseboard</span>
      </Link>

      <div className="sidebar__workspace">
        <p className="sidebar__label">Workspace</p>
        <p className="sidebar__workspace-name">Webns product team</p>
      </div>

      <NavigationLinks />

      <div className="sidebar__account">
        <Avatar name="Alex Morgan" size="sm" />
        <div className="sidebar__account-details">
          <p className="sidebar__account-name">Alex Morgan</p>
          <p className="sidebar__account-role">Product operations</p>
        </div>
      </div>
    </aside>
  )
}
