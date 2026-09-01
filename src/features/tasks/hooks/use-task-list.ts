import { useCallback, useEffect, useState } from 'react'
import { listTasks } from '../api/task-service.ts'
import type { TaskListResult } from '../api/task-service.ts'
import type { TaskListQuery } from '../types/task-query-types.ts'

type TaskListState =
  | { result: TaskListResult; status: 'success' }
  | { status: 'error'; error: Error }
  | { status: 'loading' }

export function useTaskList(query: TaskListQuery) {
  const [state, setState] = useState<TaskListState>({ status: 'loading' })
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let isCurrent = true

    queueMicrotask(() => {
      if (isCurrent) {
        setState({ status: 'loading' })
      }
    })

    void listTasks(query)
      .then((result) => {
        if (isCurrent) {
          setState({ result, status: 'success' })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setState({
            error: error instanceof Error ? error : new Error('Unable to load tasks. Please try again.'),
            status: 'error',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [query, requestVersion])

  const retry = useCallback(() => setRequestVersion((version) => version + 1), [])

  return {
    error: state.status === 'error' ? state.error : null,
    isLoading: state.status === 'loading',
    result: state.status === 'success' ? state.result : null,
    retry,
  }
}
