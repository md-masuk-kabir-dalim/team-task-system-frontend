import { useCallback, useEffect, useState } from 'react'
import { listTeamWorkload } from '../../tasks/api/task-service.ts'
import type { TeamMemberWorkload } from '../../tasks/api/task-service.ts'

type TeamWorkspaceState =
  | { members: readonly TeamMemberWorkload[]; status: 'success' }
  | { error: Error; status: 'error' }
  | { status: 'loading' }

export function useTeamWorkspace() {
  const [state, setState] = useState<TeamWorkspaceState>({ status: 'loading' })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true

    queueMicrotask(() => {
      if (isCurrent) {
        setState({ status: 'loading' })
      }
    })

    void listTeamWorkload()
      .then((members) => {
        if (isCurrent) {
          setState({ members, status: 'success' })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState({
            error: error instanceof Error ? error : new Error('Unable to load the team workspace. Please try again.'),
            status: 'error',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [requestVersion])

  const retry = useCallback(() => setRequestVersion((version) => version + 1), [])

  return {
    error: state.status === 'error' ? state.error : null,
    isLoading: state.status === 'loading',
    members: state.status === 'success' ? state.members : null,
    retry,
  }
}
