import { useCallback, useEffect } from 'react'
import { useTeamWorkspaceStore } from '../../../stores/team-workspace-store.ts'

export function useTeamWorkspace() {
  const error = useTeamWorkspaceStore((state) => state.error)
  const loadTeamWorkspace = useTeamWorkspaceStore((state) => state.load)
  const members = useTeamWorkspaceStore((state) => state.members)
  const status = useTeamWorkspaceStore((state) => state.status)

  useEffect(() => {
    void loadTeamWorkspace()
  }, [loadTeamWorkspace])

  const retry = useCallback(() => {
    void loadTeamWorkspace()
  }, [loadTeamWorkspace])

  return {
    error,
    isLoading: (status === 'idle' || status === 'loading') && members === null,
    members,
    retry,
  }
}
