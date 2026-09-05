import { beforeEach, describe, expect, it } from 'vitest'
import { useCalendarStore } from './calendar-store.ts'

describe('calendar store', () => {
  beforeEach(() => {
    useCalendarStore.setState({
      activeCategories: { design: true, projects: true, team: true, work: true },
      importNotice: null,
      selectedDate: '2026-09-02',
      view: 'week',
    })
  })

  it('keeps view, date navigation, category filters, and import feedback in Zustand', () => {
    const store = useCalendarStore.getState()

    store.setView('month')
    store.moveDate(1)
    store.toggleCategory('projects')
    store.setImportNotice('schedule.ics is ready to map to calendar tasks.')

    const state = useCalendarStore.getState()

    expect(state.view).toBe('month')
    expect(state.selectedDate).toBe('2026-10-02')
    expect(state.activeCategories.projects).toBe(false)
    expect(state.importNotice).toBe('schedule.ics is ready to map to calendar tasks.')
  })

  it('can navigate using the compact day view without changing the saved desktop preference', () => {
    const store = useCalendarStore.getState()

    store.moveDate(1, 'day')

    const state = useCalendarStore.getState()

    expect(state.selectedDate).toBe('2026-09-03')
    expect(state.view).toBe('week')
  })
})
