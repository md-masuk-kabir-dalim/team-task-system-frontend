import { Droplets, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { appRoutes, getPageContext } from '../../lib/navigation.ts'
import { useUiStore } from '../../stores/ui-store.ts'
import { IconButton } from '../ui/icon-button.tsx'
import { Sheet } from '../ui/sheet.tsx'
import { NavigationLinks } from './navigation-links.tsx'
import { GlobalTaskSearch } from './topbar.tsx'

export function MobileHeader() {
  const closeNavigation = useUiStore((state) => state.closeMobileNavigation)
  const isNavigationOpen = useUiStore((state) => state.isMobileNavigationOpen)
  const openNavigation = useUiStore((state) => state.openMobileNavigation)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { pathname, search } = useLocation()
  const pageContext = getPageContext(pathname)

  return (
    <header className="mobile-header">
      <Link aria-label="Team tasks home" className="brand brand--mobile" to={appRoutes.root}>
        <span aria-hidden="true" className="brand__mark">
          <Droplets size={22} strokeWidth={2.4} />
        </span>
        <span className="brand__name">Team</span>
      </Link>

      <p className="mobile-header__title">{pageContext.title}</p>

      <IconButton
        aria-controls="mobile-task-search"
        aria-expanded={isSearchOpen}
        label="Search tasks"
        onClick={() => setIsSearchOpen(true)}
        variant="secondary"
      >
        <Search aria-hidden="true" size={20} />
      </IconButton>

      <IconButton
        aria-controls="mobile-navigation"
        aria-expanded={isNavigationOpen}
        label="Open navigation"
        onClick={openNavigation}
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
        <NavigationLinks className="mobile-navigation__links" onNavigate={closeNavigation} />
      </Sheet>

      <Sheet
        description="Search tasks and assignees from anywhere in the workspace."
        id="mobile-task-search"
        onClose={() => setIsSearchOpen(false)}
        open={isSearchOpen}
        side="bottom"
        title="Search tasks"
      >
        <div className="mobile-task-search">
          <GlobalTaskSearch onNavigate={() => setIsSearchOpen(false)} pathname={pathname} search={search} />
        </div>
      </Sheet>
    </header>
  )
}
