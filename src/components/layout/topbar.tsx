import { Bell, CalendarDays, ListTodo, Search, Share2, Sun } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { defaultTaskListQuery, listTasks, type TaskListResult } from '../../features/tasks/api/task-service.ts'
import { appRoutes, getPageContext } from '../../lib/navigation.ts'
import { usePreferencesStore } from '../../stores/preferences-store.ts'
import { Avatar } from '../ui/avatar.tsx'
import { Button } from '../ui/button.tsx'

function getSearchValue(search: string) {
  return new URLSearchParams(search).get('search') ?? ''
}

interface GlobalTaskSearchProps {
  onNavigate?: () => void
  pathname: string
  search: string
}

export function GlobalTaskSearch({ onNavigate, pathname, search }: GlobalTaskSearchProps) {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState(() => getSearchValue(search))
  const [suggestionResult, setSuggestionResult] = useState<TaskListResult | null>(null)
  const [isSearching, setIsSearching] = useState(() => getSearchValue(search).trim().length > 0)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const requestIdRef = useRef(0)
  const suggestionListId = useId()
  const normalizedSearch = searchValue.trim()
  const suggestions = suggestionResult?.items ?? []
  const membersById = new Map(suggestionResult?.members.map((member) => [member.id, member]))

  useEffect(() => {
    const requestId = ++requestIdRef.current

    if (!normalizedSearch) {
      return undefined
    }

    const timer = globalThis.setTimeout(() => {
      void listTasks({
        ...defaultTaskListQuery,
        pageSize: 5,
        search: normalizedSearch,
      }, { delayMs: 140 }).then((result) => {
        if (requestId === requestIdRef.current) {
          setSuggestionResult(result)
          setIsSearching(false)
        }
      }).catch(() => {
        if (requestId === requestIdRef.current) {
          setSuggestionResult(null)
          setIsSearching(false)
        }
      })
    }, 180)

    return () => globalThis.clearTimeout(timer)
  }, [normalizedSearch])

  const openTask = (taskId: string) => {
    setIsSuggestionsOpen(false)
    onNavigate?.()
    navigate(appRoutes.taskDetails(taskId))
  }

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
    setIsSuggestionsOpen(false)
    onNavigate?.()
    navigate({ pathname: appRoutes.tasks, search: nextSearch ? `?${nextSearch}` : '' })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsSuggestionsOpen(false)
      setActiveSuggestionIndex(-1)
      return
    }

    if (!suggestions.length || !isSuggestionsOpen) {
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveSuggestionIndex((currentIndex) => (currentIndex + direction + suggestions.length) % suggestions.length)
      return
    }

    if (event.key === 'Enter' && activeSuggestionIndex >= 0) {
      event.preventDefault()
      const activeSuggestion = suggestions[activeSuggestionIndex]

      if (activeSuggestion) {
        openTask(activeSuggestion.id)
      }
    }
  }

  return (
    <form
      aria-label="Global search"
      className="topbar__search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsSuggestionsOpen(false)
          setActiveSuggestionIndex(-1)
        }
      }}
      onSubmit={handleSearchSubmit}
      role="search"
    >
      <div className="topbar__search-field">
        <Search aria-hidden="true" size={18} strokeWidth={1.9} />
        <label className="sr-only" htmlFor="global-task-search">Search tasks and people</label>
        <input
          aria-autocomplete="list"
          aria-controls={normalizedSearch ? suggestionListId : undefined}
          aria-expanded={isSuggestionsOpen && Boolean(normalizedSearch)}
          id="global-task-search"
          onChange={(event) => {
            const nextValue = event.target.value
            const canSearch = Boolean(nextValue.trim())
            setSearchValue(nextValue)
            setSuggestionResult(null)
            setIsSearching(canSearch)
            setIsSuggestionsOpen(canSearch)
            setActiveSuggestionIndex(-1)
          }}
          onFocus={() => setIsSuggestionsOpen(Boolean(normalizedSearch))}
          onKeyDown={handleKeyDown}
          placeholder="Search tasks and people"
          type="search"
          value={searchValue}
        />
        <span aria-hidden="true" className="topbar__search-hint">Enter</span>
      </div>
      {isSuggestionsOpen && normalizedSearch ? (
        <section aria-label="Task search suggestions" className="topbar__suggestions" id={suggestionListId}>
          {isSearching ? <p className="topbar__suggestions-status">Searching tasks…</p> : null}
          {!isSearching && suggestions.length ? (
            <ul>
              {suggestions.map((task, index) => {
                const assignee = task.assigneeId ? membersById.get(task.assigneeId) : undefined

                return (
                  <li key={task.id}>
                    <button
                      className={activeSuggestionIndex === index ? 'topbar__suggestion topbar__suggestion--active' : 'topbar__suggestion'}
                      onClick={() => openTask(task.id)}
                      onMouseMove={() => setActiveSuggestionIndex(index)}
                      type="button"
                    >
                      <span className="topbar__suggestion-icon"><ListTodo aria-hidden="true" size={15} /></span>
                      <span className="topbar__suggestion-content"><strong>{task.title}</strong><small>{assignee?.name ?? 'Unassigned'} · {task.status.replace('-', ' ')}</small></span>
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : null}
          {!isSearching && !suggestions.length ? <p className="topbar__suggestions-status">No tasks or owners match “{normalizedSearch}”.</p> : null}
          {!isSearching && suggestions.length ? <p className="topbar__suggestions-hint">Use ↑ ↓ to choose, then Enter to open. Press Enter without a selection to see all results.</p> : null}
        </section>
      ) : null}
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
    navigate(appRoutes.calendar)
  }

  const toggleAppearance = () => {
    const nextHighContrast = !isHighContrast
    document.documentElement.classList.toggle('workspace-high-contrast', nextHighContrast)
    toggleHighContrast()
    setFeedback(nextHighContrast ? 'High-contrast appearance enabled.' : 'Standard appearance restored.')
  }

  const shareWorkspace = async () => {
    const shareUrl = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Team workspace', url: shareUrl })
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
          <button aria-label="Open calendar" className="topbar__utility" onClick={openCalendar} type="button"><CalendarDays aria-hidden="true" size={18} /></button>
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
