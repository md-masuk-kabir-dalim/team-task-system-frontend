import { Droplets } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appRoutes } from '../../lib/navigation.ts'
import { Avatar } from '../ui/avatar.tsx'
import { NavigationLinks } from './navigation-links.tsx'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link aria-label="Hrivo tasks" className="brand" to={appRoutes.tasks}>
        <span aria-hidden="true" className="brand__mark">
          <Droplets size={27} strokeWidth={2.4} />
        </span>
        <span className="brand__name">Hrivo</span>
      </Link>

      <div className="sidebar__workspace">
        <p className="sidebar__label">Main</p>
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
