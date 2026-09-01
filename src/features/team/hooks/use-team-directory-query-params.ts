import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { employeeDepartments, type EmployeeDepartment, type TeamDirectoryView } from '../types/team-directory-types.ts'

interface TeamDirectoryQuery {
  department: EmployeeDepartment | 'all'
  page: number
  search: string
  view: TeamDirectoryView
}

const defaultTeamDirectoryQuery: TeamDirectoryQuery = {
  department: 'all',
  page: 1,
  search: '',
  view: 'board',
}

function isEmployeeDepartment(value: string): value is EmployeeDepartment {
  return employeeDepartments.includes(value as EmployeeDepartment)
}

function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : defaultTeamDirectoryQuery.page
}

export function parseTeamDirectoryQuery(searchParams: URLSearchParams): TeamDirectoryQuery {
  const department = searchParams.get('department')
  const view = searchParams.get('view')

  return {
    department: department && isEmployeeDepartment(department) ? department : defaultTeamDirectoryQuery.department,
    page: parsePage(searchParams.get('page')),
    search: searchParams.get('search') ?? defaultTeamDirectoryQuery.search,
    view: view === 'list' || view === 'board' ? view : defaultTeamDirectoryQuery.view,
  }
}

export function serializeTeamDirectoryQuery(query: TeamDirectoryQuery) {
  const searchParams = new URLSearchParams()

  if (query.search.trim()) {
    searchParams.set('search', query.search.trim())
  }

  if (query.department !== defaultTeamDirectoryQuery.department) {
    searchParams.set('department', query.department)
  }

  if (query.page !== defaultTeamDirectoryQuery.page) {
    searchParams.set('page', String(query.page))
  }

  if (query.view !== defaultTeamDirectoryQuery.view) {
    searchParams.set('view', query.view)
  }

  return searchParams
}

export function useTeamDirectoryQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => parseTeamDirectoryQuery(searchParams), [searchParams])

  const setQuery = useCallback((nextQuery: TeamDirectoryQuery, replace = false) => {
    setSearchParams(serializeTeamDirectoryQuery(nextQuery), { replace })
  }, [setSearchParams])

  const setSearch = useCallback((search: string) => {
    setQuery({ ...query, page: 1, search }, true)
  }, [query, setQuery])

  const setDepartment = useCallback((department: EmployeeDepartment | 'all') => {
    setQuery({ ...query, department, page: 1 })
  }, [query, setQuery])

  const setPage = useCallback((page: number) => {
    setQuery({ ...query, page })
  }, [query, setQuery])

  const setView = useCallback((view: TeamDirectoryView) => {
    setQuery({ ...query, view })
  }, [query, setQuery])

  return { query, setDepartment, setPage, setSearch, setView }
}
