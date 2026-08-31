import { Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getPageTitle } from '../../lib/navigation.ts'
import { Avatar } from '../ui/avatar.tsx'
import { IconButton } from '../ui/icon-button.tsx'

export function Topbar() {
  const { pathname } = useLocation()

  return (
    <header className="topbar">
      <div>
        <p className="topbar__eyebrow">Webns Technology Ltd.</p>
        <h1 className="topbar__title">{getPageTitle(pathname)}</h1>
      </div>

      <div className="topbar__actions">
        <IconButton label="Notifications">
          <Bell aria-hidden="true" size={19} strokeWidth={1.8} />
        </IconButton>
        <div className="account-summary">
          <Avatar name="Alex Morgan" size="sm" />
          <span className="account-summary__name">Alex Morgan</span>
        </div>
      </div>
    </header>
  )
}
