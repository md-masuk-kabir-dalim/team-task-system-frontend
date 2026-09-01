import { describe, expect, it } from 'vitest'
import { defaultTaskListQuery } from '../api/task-service.ts'
import { parseTaskListQuery, serializeTaskListQuery } from './use-task-query-params.ts'

describe('task query parameters', () => {
  it('serializes only view state that differs from the defaults', () => {
    const params = serializeTaskListQuery({
      ...defaultTaskListQuery,
      filters: {
        assigneeId: 'member-alex',
        dueDate: 'overdue',
        priority: 'urgent',
        status: 'review',
      },
      page: 3,
      search: '  invoice  ',
      sort: { direction: 'desc', field: 'title' },
      view: 'board',
    })

    expect(params.toString()).toBe('search=invoice&status=review&priority=urgent&assignee=member-alex&due=overdue&sort=title&direction=desc&page=3')
  })

  it('parses malformed values safely and preserves valid shareable state', () => {
    const query = parseTaskListQuery(new URLSearchParams('search=design&status=review&priority=high&assignee=member-jamie&due=upcoming&sort=createdAt&direction=desc&page=2&view=timeline'))

    expect(query).toMatchObject({
      filters: {
        assigneeId: 'member-jamie',
        dueDate: 'upcoming',
        priority: 'high',
        status: 'review',
      },
      page: 2,
      search: 'design',
      sort: { direction: 'desc', field: 'createdAt' },
      view: 'timeline',
    })

    const fallback = parseTaskListQuery(new URLSearchParams('status=unknown&priority=critical&due=soon&sort=chaos&direction=sideways&page=-3'))

    expect(fallback).toMatchObject({
      filters: { assigneeId: 'all', dueDate: 'all', priority: 'all', status: 'all' },
      page: 1,
      sort: { direction: 'asc', field: 'dueDate' },
      view: 'board',
    })
  })
})
