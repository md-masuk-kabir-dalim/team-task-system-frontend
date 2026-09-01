import { create } from 'zustand'
import { listTeamWorkload } from '../features/tasks/api/task-service.ts'
import type { TeamMemberWorkload } from '../features/tasks/api/task-service.ts'
import { asStoreError, type AsyncStatus } from './store-types.ts'

interface TeamWorkspaceStore {
  error: Error | null
  load: () => Promise<void>
  members: readonly TeamMemberWorkload[] | null
  refresh: () => Promise<void>
  status: AsyncStatus
}

let requestId = 0

export const useTeamWorkspaceStore = create<TeamWorkspaceStore>((set, get) => ({
  error: null,
  load: async () => {
    const currentRequestId = ++requestId
    set({ error: null, status: 'loading' })

    try {
      const members = await listTeamWorkload()

      if (currentRequestId === requestId) {
        set({ error: null, members, status: 'success' })
      }
    } catch (error: unknown) {
      if (currentRequestId === requestId) {
        set({ error: asStoreError(error, 'Unable to load the team workspace.'), status: 'error' })
      }
    }
  },
  members: null,
  refresh: async () => {
    await get().load()
  },
  status: 'idle',
}))
