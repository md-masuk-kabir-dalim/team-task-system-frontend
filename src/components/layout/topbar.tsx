import { Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { getPageContext } from '../../lib/navigation.ts'
import { Avatar } from '../ui/avatar.tsx'
import { IconButton } from '../ui/icon-button.tsx'

export function Topbar() {
  const { pathname } = useLocation()
  const pageContext = getPageContext(pathname)

  return (
    <header className="topbar">
      <div className="topbar__context">
        <p className="topbar__eyebrow">{pageContext.eyebrow}</p>
        <p className="topbar__title">{pageContext.title}</p>
      </div>

      <div aria-label="Global search" className="topbar__search" role="search">
        <Search aria-hidden="true" size={18} strokeWidth={1.9} />
        <span>Search tasks and people</span>
        <span aria-hidden="true" className="topbar__search-hint">Soon</span>
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
