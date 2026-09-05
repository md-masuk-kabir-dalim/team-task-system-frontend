export function mergeDescribedBy(...ids: Array<string | undefined>) {
  const value = ids.filter((id): id is string => Boolean(id)).join(' ')

  return value || undefined
}
