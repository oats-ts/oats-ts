import { SetCookieValue } from '@oats-ts/openapi-http'
import { isNil } from './utils'

export function serializeCookieValue(name: string, cookie: SetCookieValue<string>): string {
  const parts: string[] = [`${name}=${cookie.value}`]
  if (!isNil(cookie.expires)) {
    parts.push(`Expires=${cookie.expires}`)
  }
  if (!isNil(cookie.maxAge)) {
    parts.push(`Max-Age=${cookie.maxAge.toString()}`)
  }
  if (!isNil(cookie.domain)) {
    parts.push(`Domain=${cookie.domain}`)
  }
  if (!isNil(cookie.path)) {
    parts.push(`Path=${cookie.path}`)
  }
  if (!isNil(cookie.secure)) {
    parts.push(`Secure`)
  }
  if (!isNil(cookie.httpOnly)) {
    parts.push(`HttpOnly`)
  }
  if (!isNil(cookie.sameSite)) {
    parts.push(`SameSite=${cookie.sameSite}`)
  }
  return parts.join('; ')
}
