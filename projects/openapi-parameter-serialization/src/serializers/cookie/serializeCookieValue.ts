import { CookieValue } from '@oats-ts/openapi-http'
import { encode, isNil } from '../../utils'

export function serializeCookieValue(cookie: CookieValue<any>, name: string, value: string): string {
  const parts: string[] = [`${encode(name)}=${value}`]
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
  if (!isNil(cookie.secure)) {
    parts.push(`Secure`)
  }
  if (!isNil(cookie.httpOnly)) {
    parts.push(`HttpOnly`)
  }
  if (!isNil(cookie.sameSite)) {
    parts.push(`SameSite=${encode(cookie.sameSite)}`)
  }
  return parts.join('; ')
}
