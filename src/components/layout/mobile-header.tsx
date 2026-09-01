import { CheckSquare2, Menu } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appRoutes, getPageContext } from '../../lib/navigation.ts'
import { IconButton } from '../ui/icon-button.tsx'
import { Sheet } from '../ui/sheet.tsx'
import { NavigationLinks } from './navigation-links.tsx'

export function MobileHeader() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const { pathname } = useLocation()
  const closeNavigation = useCallback(() => setIsNavigationOpen(false), [])
  const pageContext = getPageContext(pathname)

  return (
    <header className="mobile-header">
      <Link aria-label="Pulseboard tasks" className="brand brand--mobile" to={appRoutes.tasks}>
        <span aria-hidden="true" className="brand__mark">
          <CheckSquare2 size={18} strokeWidth={2.4} />
        </span>
        <span className="brand__name">Pulseboard</span>
      </Link>

      <p className="mobile-header__title">{pageContext.title}</p>

      <IconButton
        aria-controls="mobile-navigation"
        aria-expanded={isNavigationOpen}
        label="Open navigation"
        onClick={() => setIsNavigationOpen(true)}
        variant="secondary"
      >
        <Menu aria-hidden="true" size={20} />
      </IconButton>

      <Sheet
        description="Switch between workspace views."
        id="mobile-navigation"
        onClose={closeNavigation}
        open={isNavigationOpen}
        title="Navigation"
      >
        <div className="mobile-navigation__workspace">
          <p className="mobile-navigation__eyebrow">Workspace</p>
          <p className="mobile-navigation__name">Webns product team</p>
        </div>
        <NavigationLinks onNavigate={closeNavigation} />
      </Sheet>
    </header>
  )
}
