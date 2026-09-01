import { describe, expect, it } from 'vitest'
import { parseTeamDirectoryQuery, serializeTeamDirectoryQuery } from './use-team-directory-query-params.ts'

describe('team directory query parameters', () => {
  it('serializes and parses the shareable directory view', () => {
    const query = parseTeamDirectoryQuery(new URLSearchParams('search=alex&department=Design&page=2&view=list'))

    expect(query).toEqual({ department: 'Design', page: 2, search: 'alex', view: 'list' })
    expect(serializeTeamDirectoryQuery(query).toString()).toBe('search=alex&department=Design&page=2&view=list')
  })

  it('falls back safely for unsupported query values', () => {
    expect(parseTeamDirectoryQuery(new URLSearchParams('department=Sales&page=zero&view=table'))).toEqual({
      department: 'all',
      page: 1,
      search: '',
      view: 'board',
    })
  })
})
