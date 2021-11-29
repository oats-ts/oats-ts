import { RawHttpHeaders } from '@oats-ts/openapi-http'
import { HeadersInitLike } from './typings'

export function asRawHttpHeaders(headers: HeadersInitLike): RawHttpHeaders {
  if (headers === null || headers === undefined) {
    return {}
  } else if (Array.isArray(headers)) {
    return headers.reduce(
      (hObj: Record<string, string>, [key, value]) => Object.assign(hObj, { [key.toLowerCase()]: value }),
      {},
    )
  } else if (typeof headers.forEach === 'function') {
    const obj: Record<string, string> = {}
    headers.forEach((value, key) => (obj[key.toLowerCase()] = value))
    return obj
  }
  const record = headers as Record<string, string>
  return Object.keys(record).reduce(
    (hObj, key: string) => Object.assign(hObj, { [key.toLowerCase()]: record[key] }),
    {},
  )
}
