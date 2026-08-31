import { CheckSquare2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NavigationLinks } from './navigation-links.tsx'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link aria-label="Pulseboard dashboard" className="brand" to="/dashboard">
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

      <p className="sidebar__footer">A focused home for the work that moves your team forward.</p>
    </aside>
  )
}
