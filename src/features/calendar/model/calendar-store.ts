import { create } from 'zustand'
import { addDays, addMonths, parseDateKey, toDateKey } from '../utils/calendar-utils.ts'
import type { CalendarCategory, CalendarCategoryVisibility, CalendarView } from '../types/calendar-types.ts'

interface CalendarStore {
  activeCategories: CalendarCategoryVisibility
  goToToday: () => void
  importNotice: string | null
  moveDate: (direction: -1 | 1, viewOverride?: CalendarView) => void
  selectedDate: string
  setImportNotice: (notice: string | null) => void
  setSelectedDate: (date: string) => void
  setView: (view: CalendarView) => void
  toggleCategory: (category: CalendarCategory) => void
  view: CalendarView
}

const initialCategories: CalendarCategoryVisibility = {
  design: true,
  projects: true,
  team: true,
  work: true,
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  activeCategories: initialCategories,
  goToToday: () => set({ selectedDate: toDateKey(new Date()) }),
  importNotice: null,
  moveDate: (direction, viewOverride) => {
    const currentDate = parseDateKey(get().selectedDate)
    const view = viewOverride ?? get().view
    const nextDate = view === 'month' ? addMonths(currentDate, direction) : addDays(currentDate, direction * (view === 'week' ? 7 : 1))
    set({ selectedDate: toDateKey(nextDate) })
  },
  selectedDate: toDateKey(new Date()),
  setImportNotice: (importNotice) => set({ importNotice }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setView: (view) => set({ view }),
  toggleCategory: (category) => set((state) => ({
    activeCategories: { ...state.activeCategories, [category]: !state.activeCategories[category] },
  })),
  view: 'week',
}))
