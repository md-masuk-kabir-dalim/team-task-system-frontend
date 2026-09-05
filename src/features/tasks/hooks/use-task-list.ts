import { useCallback, useEffect } from 'react'
import { useTaskStore } from '../model/task-store.ts'
import type { TaskListQuery } from '../types/task-query-types.ts'

export function useTaskList(query: TaskListQuery) {
  const error = useTaskStore((state) => state.listError)
  const loadTaskList = useTaskStore((state) => state.loadList)
  const result = useTaskStore((state) => state.list)
  const status = useTaskStore((state) => state.listStatus)

  useEffect(() => {
    void loadTaskList(query)
  }, [loadTaskList, query])

  const retry = useCallback(() => {
    void loadTaskList(query)
  }, [loadTaskList, query])

  return {
    error,
    isInitialLoading: (status === 'idle' || status === 'loading') && result === null,
    isRefreshing: status === 'loading' && result !== null,
    result,
    retry,
  }
}
