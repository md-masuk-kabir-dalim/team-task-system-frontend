import { useCallback, useEffect } from 'react'
import { useTaskStore } from '../../../stores/task-store.ts'

export function useTaskDetail(taskId: string | undefined) {
  const detail = useTaskStore((state) => state.detail)
  const error = useTaskStore((state) => state.detailError)
  const loadTaskDetail = useTaskStore((state) => state.loadDetail)
  const status = useTaskStore((state) => state.detailStatus)

  useEffect(() => {
    void loadTaskDetail(taskId)
  }, [loadTaskDetail, taskId])

  const retry = useCallback(() => {
    void loadTaskDetail(taskId)
  }, [loadTaskDetail, taskId])

  return {
    detail,
    error,
    isLoading: status === 'idle' || status === 'loading',
    retry,
  }
}
