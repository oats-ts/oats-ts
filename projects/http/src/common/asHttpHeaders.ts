import { HeadersInitLike } from './typings'
import { HttpHeaders } from '../typings'

export function asHttpHeaders(headers: HeadersInitLike): HttpHeaders {
  if (headers === null || headers === undefined) {
    return {}
  } else if (Array.isArray(headers)) {
    return headers.reduce((hObj: Record<string, string>, [key, value]) => Object.assign(hObj, { [key]: value }), {})
  } else if (typeof headers.forEach === 'function') {
    const merged: Record<string, string> = {}
    headers.forEach((value, key) => (merged[key] = value))
    return Object.assign(merged, headers || {})
  }
  return { ...(headers as Record<string, string>) }
}
