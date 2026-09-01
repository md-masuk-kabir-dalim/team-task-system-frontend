import { Search } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { appRoutes, getPageContext } from '../../lib/navigation.ts'
import { Avatar } from '../ui/avatar.tsx'

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
  const pageContext = getPageContext(pathname)

  return (
    <header className="topbar">
      <div className="topbar__context">
        <p className="topbar__eyebrow">{pageContext.eyebrow}</p>
        <p className="topbar__title">{pageContext.title}</p>
      </div>

      <GlobalTaskSearch key={`${pathname}${search}`} pathname={pathname} search={search} />

      <div className="topbar__actions">
        <div className="account-summary">
          <Avatar name="Alex Morgan" size="sm" />
          <span className="account-summary__name">Alex Morgan</span>
        </div>
      </div>
    </header>
  )
}
