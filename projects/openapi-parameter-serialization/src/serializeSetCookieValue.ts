import { SetCookieValue } from '@oats-ts/openapi-http'
import { encode, isNil } from './utils'

export function serializeSetCookieValue(cookie: SetCookieValue): string {
  const parts: string[] = [`${cookie.name}=${cookie.value}`]
  if (!isNil(cookie.expires)) {
    parts.push(`Expires=${encode(cookie.expires)}`)
  }
  if (!isNil(cookie.maxAge)) {
    parts.push(`Max-Age=${encode(cookie.maxAge.toString())}`)
  }
  if (!isNil(cookie.domain)) {
    parts.push(`Domain=${encode(cookie.domain)}`)
  }
  if (!isNil(cookie.path)) {
    parts.push(`Path=${encode(cookie.path)}`)
  }
  if (!isNil(cookie.sameSite)) {
    parts.push(`SameSite=${encode(cookie.sameSite)}`)
  }
  if (!isNil(cookie.secure)) {
    parts.push(`Secure`)
  }
  if (!isNil(cookie.httpOnly)) {
    parts.push(`HttpOnly`)
  }
  return parts.join('; ')
}
