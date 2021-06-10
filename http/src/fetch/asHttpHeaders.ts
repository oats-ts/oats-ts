import { HttpHeaders } from '..'

export function asHttpHeaders(headers: HeadersInit): HttpHeaders {
  if (headers === null || headers === undefined) {
    return {}
  } else if (Array.isArray(headers)) {
    return headers.reduce((hObj: Record<string, string>, [key, value]) => Object.assign(hObj, { [key]: value }), {})
  } else if (headers instanceof Headers) {
    const merged: Record<string, string> = {}
    headers.forEach((value, key) => (merged[key] = value))
    return Object.assign(merged, headers || {})
  }
  return { ...headers }
}
