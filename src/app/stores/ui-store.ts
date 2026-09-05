import { create } from 'zustand'

interface UiStore {
  closeCreateTask: () => void
  closeFilterSheet: () => void
  closeMobileNavigation: () => void
  closeSortSheet: () => void
  isCreateTaskOpen: boolean
  isFilterSheetOpen: boolean
  isMobileNavigationOpen: boolean
  isSidebarCollapsed: boolean
  isSortSheetOpen: boolean
  openCreateTask: () => void
  openFilterSheet: () => void
  openMobileNavigation: () => void
  openSortSheet: () => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  closeCreateTask: () => set({ isCreateTaskOpen: false }),
  closeFilterSheet: () => set({ isFilterSheetOpen: false }),
  closeMobileNavigation: () => set({ isMobileNavigationOpen: false }),
  closeSortSheet: () => set({ isSortSheetOpen: false }),
  isCreateTaskOpen: false,
  isFilterSheetOpen: false,
  isMobileNavigationOpen: false,
  isSidebarCollapsed: false,
  isSortSheetOpen: false,
  openCreateTask: () => set({ isCreateTaskOpen: true }),
  openFilterSheet: () => set({ isFilterSheetOpen: true }),
  openMobileNavigation: () => set({ isMobileNavigationOpen: true }),
  openSortSheet: () => set({ isSortSheetOpen: true }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
