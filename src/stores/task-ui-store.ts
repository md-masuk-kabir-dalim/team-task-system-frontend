import { create } from 'zustand'

interface TaskUiStore {
  closeFilterSheet: () => void
  isFilterSheetOpen: boolean
  openFilterSheet: () => void
}

export const useTaskUiStore = create<TaskUiStore>((set) => ({
  closeFilterSheet: () => set({ isFilterSheetOpen: false }),
  isFilterSheetOpen: false,
  openFilterSheet: () => set({ isFilterSheetOpen: true }),
}))
