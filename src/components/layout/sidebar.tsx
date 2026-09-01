import { Droplets, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn.ts'
import { appRoutes } from '../../lib/navigation.ts'
import { useUiStore } from '../../stores/ui-store.ts'
import { Avatar } from '../ui/avatar.tsx'
import { IconButton } from '../ui/icon-button.tsx'
import { NavigationLinks } from './navigation-links.tsx'

export function Sidebar() {
  const isCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useUiStore((state) => state.toggleSidebar)

  return (
    <aside className={cn('sidebar', isCollapsed && 'sidebar--collapsed')}>
      <div className="sidebar__brand-row">
        <Link aria-label="Team tasks" className="brand" to={appRoutes.tasks}>
          <span aria-hidden="true" className="brand__mark">
            <Droplets size={27} strokeWidth={2.4} />
          </span>
          <span className="brand__name">Team</span>
        </Link>
        <IconButton
          className="sidebar__collapse-control"
          label={isCollapsed ? '' : ''}
          onClick={toggleSidebar}
          variant="secondary"
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </IconButton>
      </div>

      <div className="sidebar__workspace">
        <p className="sidebar__label">Main</p>
        <p className="sidebar__workspace-name">Webns product team</p>
      </div>

      <NavigationLinks />

      <div className="sidebar__account">
        <Avatar name="Alex Morgan" size="sm" src="/images/alex-morgan.png" />
        <div className="sidebar__account-details">
          <p className="sidebar__account-name">Alex Morgan</p>
          <p className="sidebar__account-role">Product operations</p>
        </div>
      </div>
    </aside>
  )
}
