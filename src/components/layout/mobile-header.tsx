import { CheckSquare2, Menu, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useEscapeKey } from '../../hooks/use-escape-key.ts'
import { getPageTitle } from '../../lib/navigation.ts'
import { IconButton } from '../ui/icon-button.tsx'
import { NavigationLinks } from './navigation-links.tsx'

export function MobileHeader() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const { pathname } = useLocation()
  const closeNavigation = useCallback(() => setIsNavigationOpen(false), [])

  useEscapeKey(isNavigationOpen, closeNavigation)

  return (
    <header className="mobile-header">
      <Link aria-label="Pulseboard dashboard" className="brand brand--mobile" to="/dashboard">
        <span aria-hidden="true" className="brand__mark">
          <CheckSquare2 size={18} strokeWidth={2.4} />
        </span>
        <span className="brand__name">Pulseboard</span>
      </Link>

      <p className="mobile-header__title">{getPageTitle(pathname)}</p>

      <IconButton
        aria-controls="mobile-navigation"
        aria-expanded={isNavigationOpen}
        label={isNavigationOpen ? 'Close navigation' : 'Open navigation'}
        onClick={() => setIsNavigationOpen((open) => !open)}
        variant="secondary"
      >
        {isNavigationOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </IconButton>

      {isNavigationOpen ? (
        <div className="mobile-navigation">
          <button
            aria-label="Close navigation"
            className="mobile-navigation__backdrop"
            onClick={closeNavigation}
            type="button"
          />
          <nav aria-label="Mobile navigation" className="mobile-navigation__panel" id="mobile-navigation">
            <div className="mobile-navigation__heading">
              <span className="mobile-navigation__eyebrow">Workspace</span>
              <span className="mobile-navigation__name">Webns product team</span>
            </div>
            <NavigationLinks onNavigate={closeNavigation} />
          </nav>
        </div>
      ) : null}
    </header>
  )
}
