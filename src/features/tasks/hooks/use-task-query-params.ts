import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { defaultTaskFilters, defaultTaskListQuery, defaultTaskSort } from '../api/task-service.ts'
import {
  isDueDateFilter,
  isSortDirection,
  isTaskSortField,
  isTaskView,
  type TaskFilters,
  type TaskListQuery,
  type TaskSort,
  type TaskView,
} from '../types/task-query-types.ts'
import { isTaskPriority, isTaskStatus } from '../types/task-types.ts'

function parsePage(value: string | null) {
  const page = Number(value)

  return Number.isInteger(page) && page > 0 ? page : defaultTaskListQuery.page
}

export function parseTaskListQuery(searchParams: URLSearchParams): TaskListQuery {
  const status = searchParams.get('status')
  const priority = searchParams.get('priority')
  const dueDate = searchParams.get('due')
  const assigneeId = searchParams.get('assignee')
  const sortField = searchParams.get('sort')
  const direction = searchParams.get('direction')
  const view = searchParams.get('view')

  return {
    filters: {
      assigneeId: assigneeId && assigneeId !== 'all' ? assigneeId : defaultTaskFilters.assigneeId,
      dueDate: dueDate && isDueDateFilter(dueDate) ? dueDate : defaultTaskFilters.dueDate,
      priority: priority && isTaskPriority(priority) ? priority : defaultTaskFilters.priority,
      status: status && isTaskStatus(status) ? status : defaultTaskFilters.status,
    },
    page: parsePage(searchParams.get('page')),
    pageSize: defaultTaskListQuery.pageSize,
    search: searchParams.get('search') ?? '',
    sort: {
      direction: direction && isSortDirection(direction) ? direction : defaultTaskSort.direction,
      field: sortField && isTaskSortField(sortField) ? sortField : defaultTaskSort.field,
    },
    view: view && isTaskView(view) ? view : defaultTaskListQuery.view,
  }
}

export function serializeTaskListQuery(query: TaskListQuery) {
  const searchParams = new URLSearchParams()

  if (query.search.trim()) {
    searchParams.set('search', query.search.trim())
  }

  if (query.filters.status !== 'all') {
    searchParams.set('status', query.filters.status)
  }

  if (query.filters.priority !== 'all') {
    searchParams.set('priority', query.filters.priority)
  }

  if (query.filters.assigneeId !== 'all') {
    searchParams.set('assignee', query.filters.assigneeId)
  }

  if (query.filters.dueDate !== 'all') {
    searchParams.set('due', query.filters.dueDate)
  }

  if (query.sort.field !== defaultTaskSort.field) {
    searchParams.set('sort', query.sort.field)
  }

  if (query.sort.direction !== defaultTaskSort.direction) {
    searchParams.set('direction', query.sort.direction)
  }

  if (query.page !== defaultTaskListQuery.page) {
    searchParams.set('page', String(query.page))
  }

  if (query.view !== defaultTaskListQuery.view) {
    searchParams.set('view', query.view)
  }

  return searchParams
}

export function useTaskQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => parseTaskListQuery(searchParams), [searchParams])

  const setQuery = useCallback((nextQuery: TaskListQuery, replace = false) => {
    setSearchParams(serializeTaskListQuery(nextQuery), { replace })
  }, [setSearchParams])

  const setSearch = useCallback((search: string) => {
    setQuery({ ...query, page: 1, search }, true)
  }, [query, setQuery])

  const setFilters = useCallback((filters: TaskFilters) => {
    setQuery({ ...query, filters, page: 1 })
  }, [query, setQuery])

  const setSort = useCallback((sort: TaskSort) => {
    setQuery({ ...query, page: 1, sort })
  }, [query, setQuery])

  const setPage = useCallback((page: number) => {
    setQuery({ ...query, page })
  }, [query, setQuery])

  const setView = useCallback((view: TaskView) => {
    setQuery({ ...query, view })
  }, [query, setQuery])

  const clearView = useCallback(() => {
    setQuery({
      ...defaultTaskListQuery,
      filters: { ...defaultTaskFilters },
      sort: { ...defaultTaskSort },
    })
  }, [setQuery])

  return {
    clearView,
    query,
    setFilters,
    setPage,
    setSearch,
    setSort,
    setView,
  }
}
