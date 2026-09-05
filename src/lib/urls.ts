export const BASE_PATH = '/DuoMaoFF'

export function siteUrl(value: string): string {
  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value === BASE_PATH ||
    value.startsWith(BASE_PATH + '/')
  )
    return value
  return BASE_PATH + value
}

export function apiFetch(value: string, options?: RequestInit) {
  return fetch(siteUrl(value), options)
}
