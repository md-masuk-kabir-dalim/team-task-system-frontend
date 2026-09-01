import { create } from 'zustand'

interface TaskUiStore {
  closeCreateTask: () => void
  closeFilterSheet: () => void
  isCreateTaskOpen: boolean
  isFilterSheetOpen: boolean
  openCreateTask: () => void
  openFilterSheet: () => void
}

export const useTaskUiStore = create<TaskUiStore>((set) => ({
  closeCreateTask: () => set({ isCreateTaskOpen: false }),
  closeFilterSheet: () => set({ isFilterSheetOpen: false }),
  isCreateTaskOpen: false,
  isFilterSheetOpen: false,
  openCreateTask: () => set({ isCreateTaskOpen: true }),
  openFilterSheet: () => set({ isFilterSheetOpen: true }),
}))
