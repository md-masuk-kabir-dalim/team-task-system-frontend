import { create } from 'zustand'

interface PreferencesStore {
  areNotificationsRead: boolean
  isHighContrast: boolean
  isNotificationsOpen: boolean
  markNotificationsRead: () => void
  toggleHighContrast: () => void
  toggleNotifications: () => void
}

export const usePreferencesStore = create<PreferencesStore>((set) => ({
  areNotificationsRead: false,
  isHighContrast: false,
  isNotificationsOpen: false,
  markNotificationsRead: () => set({ areNotificationsRead: true }),
  toggleHighContrast: () => set((state) => ({ isHighContrast: !state.isHighContrast })),
  toggleNotifications: () => set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),
}))
