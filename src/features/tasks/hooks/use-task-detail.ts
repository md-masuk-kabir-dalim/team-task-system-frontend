import { useCallback, useEffect, useState } from 'react'
import { getTaskDetailById } from '../api/task-service.ts'
import type { TaskDetailResult } from '../api/task-service.ts'
import type { Task } from '../types/task-types.ts'

type TaskDetailState =
  | { detail: TaskDetailResult | null; status: 'success' }
  | { error: Error; status: 'error' }
  | { status: 'loading' }

export function useTaskDetail(taskId: string | undefined) {
  const [state, setState] = useState<TaskDetailState>({ status: 'loading' })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true

    if (!taskId) {
      queueMicrotask(() => {
        if (isCurrent) {
          setState({ detail: null, status: 'success' })
        }
      })

      return () => {
        isCurrent = false
      }
    }

    queueMicrotask(() => {
      if (isCurrent) {
        setState({ status: 'loading' })
      }
    })

    void getTaskDetailById(taskId)
      .then((detail) => {
        if (isCurrent) {
          setState({ detail, status: 'success' })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState({
            error: error instanceof Error ? error : new Error('Unable to load task details. Please try again.'),
            status: 'error',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [requestVersion, taskId])

  const retry = useCallback(() => setRequestVersion((version) => version + 1), [])
  const replaceTask = useCallback((task: Task) => {
    setState((currentState) => {
      if (currentState.status !== 'success' || currentState.detail === null) {
        return currentState
      }

      return {
        detail: { ...currentState.detail, task },
        status: 'success',
      }
    })
  }, [])

  return {
    detail: state.status === 'success' ? state.detail : null,
    error: state.status === 'error' ? state.error : null,
    isLoading: state.status === 'loading',
    replaceTask,
    retry,
  }
}
