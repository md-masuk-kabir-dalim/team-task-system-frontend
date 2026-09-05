import { beforeEach, describe, expect, it } from 'vitest'
import { useUiStore } from './ui-store.ts'

describe('ui store', () => {
  beforeEach(() => {
    useUiStore.setState({ isSidebarCollapsed: false })
  })

  it('keeps the sidebar visibility preference in shared UI state', () => {
    useUiStore.getState().toggleSidebar()

    expect(useUiStore.getState().isSidebarCollapsed).toBe(true)

    useUiStore.getState().toggleSidebar()

    expect(useUiStore.getState().isSidebarCollapsed).toBe(false)
  })
})
