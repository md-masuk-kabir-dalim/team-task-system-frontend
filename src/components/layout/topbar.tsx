import { Bell, CalendarDays, Search, Share2, Sun } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { appRoutes, getPageContext } from '../../lib/navigation.ts'
import { usePreferencesStore } from '../../stores/preferences-store.ts'
import { Avatar } from '../ui/avatar.tsx'
import { Button } from '../ui/button.tsx'

function getSearchValue(search: string) {
  return new URLSearchParams(search).get('search') ?? ''
}

interface GlobalTaskSearchProps {
  pathname: string
  search: string
}

function GlobalTaskSearch({ pathname, search }: GlobalTaskSearchProps) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState(() => getSearchValue(search))

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextParams = new URLSearchParams(pathname === appRoutes.tasks ? search : undefined)
    const normalizedSearch = searchValue.trim()

    if (normalizedSearch) {
      nextParams.set('search', normalizedSearch)
    } else {
      nextParams.delete('search')
    }

    nextParams.delete('page')
    const nextSearch = nextParams.toString()
    navigate({ pathname: appRoutes.tasks, search: nextSearch ? `?${nextSearch}` : '' })
  }

  return (
    <form aria-label="Global search" className="topbar__search" onSubmit={handleSearchSubmit} role="search">
      <Search aria-hidden="true" size={18} strokeWidth={1.9} />
      <label className="sr-only" htmlFor="global-task-search">Search tasks and people</label>
      <input
        id="global-task-search"
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Search tasks and people"
        type="search"
        value={searchValue}
      />
      <span aria-hidden="true" className="topbar__search-hint">Enter</span>
    </form>
  )
}

export function Topbar() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const pageContext = getPageContext(pathname)
  const [feedback, setFeedback] = useState<string | null>(null)
  const areNotificationsRead = usePreferencesStore((state) => state.areNotificationsRead)
  const isHighContrast = usePreferencesStore((state) => state.isHighContrast)
  const isNotificationsOpen = usePreferencesStore((state) => state.isNotificationsOpen)
  const markNotificationsRead = usePreferencesStore((state) => state.markNotificationsRead)
  const toggleHighContrast = usePreferencesStore((state) => state.toggleHighContrast)
  const toggleNotifications = usePreferencesStore((state) => state.toggleNotifications)

  const openCalendar = () => {
    navigate({ pathname: appRoutes.tasks, search: '?view=timeline' })
  }

  const toggleAppearance = () => {
    const nextHighContrast = !isHighContrast
    document.documentElement.classList.toggle('hrivo-high-contrast', nextHighContrast)
    toggleHighContrast()
    setFeedback(nextHighContrast ? 'High-contrast appearance enabled.' : 'Standard appearance restored.')
  }

  const shareWorkspace = async () => {
    const shareUrl = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Hrivo workspace', url: shareUrl })
        setFeedback('Workspace share sheet opened.')
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setFeedback('Workspace link copied to your clipboard.')
      } else {
        const input = document.createElement('textarea')
        input.value = shareUrl
        input.style.position = 'fixed'
        input.style.opacity = '0'
        document.body.append(input)
        input.select()
        document.execCommand('copy')
        input.remove()
        setFeedback('Workspace link copied to your clipboard.')
      }
    } catch (error: unknown) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setFeedback('Unable to share the workspace right now.')
      }
    }
  }

  return (
    <header className="topbar">
      <div className="topbar__context">
        <p className="topbar__eyebrow">{pageContext.eyebrow}</p>
        <p className="topbar__title">{pageContext.title}</p>
      </div>

      <GlobalTaskSearch key={`${pathname}${search}`} pathname={pathname} search={search} />

      <div className="topbar__actions">
        <div aria-label="Workspace utilities" className="topbar__utilities">
          <button aria-label="Open task timeline" className="topbar__utility" onClick={openCalendar} type="button"><CalendarDays aria-hidden="true" size={18} /></button>
          <div className="topbar__notifications">
            <button aria-controls="workspace-notifications" aria-expanded={isNotificationsOpen} aria-label="View notifications" className={`topbar__utility topbar__utility--notification${areNotificationsRead ? ' topbar__utility--notification-read' : ''}`} onClick={toggleNotifications} type="button"><Bell aria-hidden="true" size={18} /></button>
            {isNotificationsOpen ? (
              <section aria-label="Workspace notifications" className="topbar__notification-panel" id="workspace-notifications">
                <header><strong>Notifications</strong><button onClick={() => { markNotificationsRead(); setFeedback('Notifications marked as read.') }} type="button">Mark all read</button></header>
                <p>Three tasks have updates waiting for review.</p>
              </section>
            ) : null}
          </div>
          <button aria-label="Toggle high contrast" aria-pressed={isHighContrast} className="topbar__utility" onClick={toggleAppearance} type="button"><Sun aria-hidden="true" size={19} /></button>
        </div>
        <div aria-label="Collaborators" className="topbar__collaborators">
          <Avatar name="Alex Morgan" size="sm" src="/images/alex-morgan.png" />
          <Avatar name="Jamie Chen" size="sm" />
        </div>
        <Button className="topbar__share" onClick={() => void shareWorkspace()} variant="primary"><Share2 aria-hidden="true" size={17} />Share</Button>
      </div>
      {feedback ? <p aria-live="polite" className="topbar__feedback">{feedback}</p> : null}
    </header>
  )
}
