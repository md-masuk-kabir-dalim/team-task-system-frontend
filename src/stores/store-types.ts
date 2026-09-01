export type AsyncStatus = 'error' | 'idle' | 'loading' | 'success'

export function asStoreError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback)
}
